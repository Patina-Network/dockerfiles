import { DockerClient, Utils } from "@tahminator/pipeline";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const { required } = Utils;

const { ver, shouldUpload } = await yargs(hideBin(process.argv))
  .option("ver", {
    type: "string",
    demandOption: true,
  })
  .option("shouldUpload", {
    type: "boolean",
    demandOption: true,
    default: true,
  })
  .strict()
  .parse();

const targets = ["pg-az", "gerrit"] as const;

export async function main() {
  const { dockerHubPat, dockerHubUsername } = parseCiEnv();
  await using dockerClient = await DockerClient.create(
    dockerHubUsername,
    dockerHubPat,
  );

  for (const target of targets) {
    const dir = `src/${target}` as const;
    const dockerFileLocation = `${dir}/Dockerfile` as const;
    console.log(Utils.Colors.cyan(`Building ${dockerFileLocation}...`));
    await dockerClient.buildImage({
      dockerFileLocation,
      shouldUpload,
      dockerRepository: target,
      tags: ["latest", ver],
    });
  }
}

function parseCiEnv() {
  const dockerHubPat = required(process.env["DOCKER_HUB_PAT"]);

  const dockerHubUsername = required(process.env["DOCKER_HUB_USERNAME"]);

  return { dockerHubPat, dockerHubUsername };
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
