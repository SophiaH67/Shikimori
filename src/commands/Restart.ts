import Command from "eris-boreas/lib/src/conversation/Command";
import Conversation from "eris-boreas/lib/src/conversation/Conversation";
import Longhorn from "../lib/longhorn";

export default class Fix implements Command {
  public aliases = ["restart"];
  public description = "Restarts deployments in a kubernetes namespace";
  public usage = "restart <namespace>";

  public async run(conversation: Conversation, args: string[]) {
    if (args.length === 1) {
      throw new Error("You must specify a namespace");
    }
    const namespace = args[1];
    const longhorn = new Longhorn();
    await longhorn.restartDeploymentsInNamespace(namespace);
    return "It should be restarted now";
  }
}
