export interface Volume {
  accessMode: string;
  actions: Actions;
  backingImage: string;
  backupStatus: any[];
  cloneStatus: CloneStatus;
  conditions: Conditions;
  controllers: Controller[];
  created: string;
  currentImage: string;
  dataLocality: string;
  dataSource: string;
  disableFrontend: boolean;
  diskSelector: any;
  encrypted: boolean;
  engineImage: string;
  fromBackup: string;
  frontend: string;
  id: string;
  kubernetesStatus: KubernetesStatus;
  lastAttachedBy: string;
  lastBackup: string;
  lastBackupAt: string;
  links: Links;
  migratable: boolean;
  name: string;
  nodeSelector: any;
  numberOfReplicas: number;
  purgeStatus: PurgeStatu[];
  ready: boolean;
  rebuildStatus: any[];
  recurringJobSelector: any;
  replicaAutoBalance: string;
  replicas: Replica[];
  restoreRequired: boolean;
  restoreStatus: RestoreStatus[];
  revisionCounterDisabled: boolean;
  robustness: string;
  shareEndpoint: string;
  shareState: string;
  size: string;
  staleReplicaTimeout: number;
  standby: boolean;
  state: string;
  type: string;
}

export interface Actions {
  activate: string;
  attach: string;
  cancelExpansion: string;
  detach: string;
  engineUpgrade: string;
  pvCreate: string;
  pvcCreate: string;
  recurringJobAdd: string;
  recurringJobDelete: string;
  recurringJobList: string;
  replicaRemove: string;
  snapshotBackup: string;
  snapshotCreate: string;
  snapshotDelete: string;
  snapshotGet: string;
  snapshotList: string;
  snapshotPurge: string;
  snapshotRevert: string;
  updateDataLocality: string;
  updateReplicaAutoBalance: string;
  updateReplicaCount: string;
}

export interface CloneStatus {
  snapshot: string;
  sourceVolume: string;
  state: string;
}

export interface Conditions {
  restore: Restore;
  scheduled: Scheduled;
  toomanysnapshots: Toomanysnapshots;
}

export interface Restore {
  lastProbeTime: string;
  lastTransitionTime: string;
  message: string;
  reason: string;
  status: string;
  type: string;
}

export interface Scheduled {
  lastProbeTime: string;
  lastTransitionTime: string;
  message: string;
  reason: string;
  status: string;
  type: string;
}

export interface Toomanysnapshots {
  lastProbeTime: string;
  lastTransitionTime: string;
  message: string;
  reason: string;
  status: string;
  type: string;
}

export interface Controller {
  actualSize: string;
  address: string;
  currentImage: string;
  endpoint: string;
  engineImage: string;
  hostId: string;
  instanceManagerName: string;
  isExpanding: boolean;
  lastExpansionError: string;
  lastExpansionFailedAt: string;
  lastRestoredBackup: string;
  name: string;
  requestedBackupRestore: string;
  running: boolean;
  size: string;
}

export interface KubernetesStatus {
  lastPVCRefAt: string;
  lastPodRefAt: string;
  namespace: string;
  pvName: string;
  pvStatus: string;
  pvcName: string;
  workloadsStatus: WorkloadsStatu[];
}

export interface WorkloadsStatu {
  podName: string;
  podStatus: string;
  workloadName: string;
  workloadType: string;
}

export interface Links {
  self: string;
}

export interface PurgeStatu {
  actions: any;
  error: string;
  isPurging: boolean;
  links: any;
  progress: number;
  replica: string;
  state: string;
}

export interface Replica {
  address: string;
  currentImage: string;
  dataPath: string;
  diskID: string;
  diskPath: string;
  engineImage: string;
  failedAt: string;
  hostId: string;
  instanceManagerName: string;
  mode: string;
  name: string;
  running: boolean;
}

export interface RestoreStatus {
  actions: any;
  backupURL: string;
  error: string;
  filename: string;
  isRestoring: boolean;
  lastRestored: string;
  links: any;
  progress: number;
  replica: string;
  state: string;
}
