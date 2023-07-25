import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { generate } from "~/lib/generate";

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

export default async function Page({ searchParams }: Props) {
  if (
    !searchParams.url ||
    typeof searchParams.url !== "string" ||
    !(
      searchParams.url.startsWith("https://musescore.com/") ||
      searchParams.url.startsWith("https://www.musescore.com/")
    )
  ) {
    return redirect("/");
  }

  const { path, resources, time } = await generate(searchParams.url);

  return (
    <main className="flex flex-grow flex-col items-start gap-4">
      <p>
        Detected {resources.length} page{resources.length === 1 ? "" : "s"}.
        Took {(time / 1000).toFixed(2)} seconds to generate. Score is stored as{" "}
        {resources.at(0)?.includes(".png") ? "PNG" : "SVG"} files.
      </p>

      <div className="flex gap-2">
        <Button variant="secondary" asChild>
          <a href={`/${path}`} target="_blank">
            Download PDF
          </a>
        </Button>

        <Button variant="ghost" asChild>
          <a href={searchParams.url} target="_blank">
            Visit Original Score
          </a>
        </Button>
      </div>

      <div className="grid w-full grid-cols-3 gap-4 rounded-lg bg-secondary p-4">
        {resources.map((resource, i) => (
          <img
            src={resource}
            alt={`Page ${i + 1}`}
            className="rounded-md"
            key={i}
          />
        ))}
      </div>

      <div className="flex w-full flex-col gap-2 rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold">Image Links</h3>
        <ol className="flex list-decimal flex-col gap-2">
          {resources.map((resource, i) => (
            <li
              key={i}
              className="ml-8 break-all font-mono text-xs text-muted-foreground transition-colors hover:text-muted-foreground/80"
            >
              <a href={resource} target="_blank">
                {resource}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
