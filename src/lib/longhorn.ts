import * as k8s from "@kubernetes/client-node";
import { NodeSSH } from "node-ssh";
import { Volume } from "./interfaces/LonghornVolume";
import sleep from "sleep-promise";
import fetch from "node-fetch";
import { exec } from "child_process";
import util from "util";

const pexec = util.promisify(exec);

export default class Longhorn {
  public static url = "http://localhost:9191";
  private k8sApi: k8s.CoreV1Api;
  private k8sAppsApi: k8s.AppsV1Api;

  constructor() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    this.k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    this.k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
  }

  public get(endpoint: string) {
    return fetch(Longhorn.url + endpoint);
  }

  public post(endpoint: string, data: any) {
    return fetch(Longhorn.url + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  public async getVolume(volumeId: string): Promise<Volume> {
    return (await (await this.get(`/v1/volumes/${volumeId}`)).json()) as Volume;
  }

  public async getVolumesInNamespace(namespace: string): Promise<Volume[]> {
    const volumes = await this.k8sApi.listNamespacedPersistentVolumeClaim(
      namespace
    );
    const volumeIds = volumes.body.items.map(
      (volume) => volume.spec?.volumeName
    );
    return await Promise.all(
      volumeIds.map((volumeId) => this.getVolume(volumeId as string))
    );
  }

  public async attachVolume(volume: Volume, hostId: string): Promise<void> {
    console.log(`Attaching ${volume.id} to ${hostId}`);
    await (
      await this.post(`/v1/volumes/${volume.id}?action=attach`, {
        hostId: "momosuzu-nene",
        disableFrontend: false,
      })
    ).json();
    // Wait for volume to attach, after 10 attempts we recurse
    let attempts = 0;
    while (
      !(await this.runCommand(`ls /dev/longhorn/${volume.id}`)).stdout.trim()
    ) {
      if (attempts++ > 10) {
        return await this.attachVolume(volume, hostId);
      }
      await sleep(1000);
    }
  }

  public async detachVolume(volume: Volume) {
    console.log(`Detaching ${volume.id}`);
    return await (
      await this.post(`/v1/volumes/${volume.id}?action=detach`, null)
    ).json();
  }

  public async runCommand(command: string) {
    const ssh = await new NodeSSH().connect({
      host: "192.168.103.25",
      username: "root",
      password: process.env.SSH_PASSWORD || "password123",
    });
    return await ssh.execCommand(command);
  }

  public async fixVolume(volume: Volume): Promise<Volume> {
    await this.attachVolume(volume, "momosuzu-nene");
    // Fsck
    await this.runCommand(`fsck -a /dev/longhorn/${volume.id}`);
    await this.runCommand("sync");
    await this.detachVolume(volume);

    return this.getVolume(volume.id);
  }

  public async scaleDeployment(
    deployment: string,
    namespace: string,
    replicas: number
  ) {
    await pexec(
      `kubectl scale --replicas=${replicas} -n ${namespace} deployment ${deployment}`
    );
  }

  public async fixDeployment(deployment: k8s.V1Deployment) {
    console.log(`Fixing ${deployment.metadata?.name}`);
    await this.scaleDeployment(
      deployment.metadata!.name!,
      deployment.metadata!.namespace!,
      0
    );
    for (const volume of deployment.spec?.template.spec?.volumes || []) {
      if (!volume.persistentVolumeClaim?.claimName) continue;
      const kvolume = await this.k8sApi.readNamespacedPersistentVolumeClaim(
        volume.persistentVolumeClaim.claimName,
        deployment.metadata!.namespace!
      );
      const longhornVolume = await this.getVolume(
        kvolume.body.spec?.volumeName || ""
      );
      await this.fixVolume(longhornVolume);
    }
    await this.scaleDeployment(
      deployment.metadata!.name!,
      deployment.metadata!.namespace!,
      1
    );
  }

  public async fixVolumesInNamespace(namespace: string): Promise<void> {
    let deployments = (
      await this.k8sAppsApi.listNamespacedDeployment(namespace)
    ).body.items;
    deployments = deployments.filter(
      // All deployments that have a volume
      (deployment) => (deployment.spec?.template.spec?.volumes?.length || 0) > 0
    );
    await Promise.all(
      deployments.map((deployment) => this.fixDeployment(deployment))
    );
  }

  public async restartDeploymentsInNamespace(namespace: string): Promise<void> {
    await pexec(`kubectl rollout restart deployment -n ${namespace}`);
  }
}
