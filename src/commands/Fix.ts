import Command from "../../../eris-boreas/src/conversation/Command";
import Conversation from "../../../eris-boreas/src/conversation/Conversation";
import Longhorn from "../lib/longhorn";

export default class Fix implements Command {
  public aliases = ["fix"];
  public description = "Fixes a kubernetes namespace";
  public usage = "fix <namespace>";

  public async run(conversation: Conversation, args: string[]) {
    if (args.length === 1) {
      throw new Error("You must specify a namespace");
    }
    const namespace = args[1];
    const longhorn = new Longhorn();
    await longhorn.fixVolumesInNamespace(namespace);
    return "It should be fixed now";
  }
}