const MEDIUM_URL =
  "https://medium.com/@adedamolaola/simplifying-the-design-process-with-design-in-a-box-1741139a4e1a";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center justify-center px-6 py-8 md:px-20 md:py-20">
        <div className="flex w-full max-w-[848px] flex-col gap-8 md:gap-[62px]">
          <div className="flex flex-col items-start justify-center gap-4">
            <h1 className="text-lg leading-[1.2] font-bold text-[var(--foreground)] md:text-[24px]">
              Why i built Foundry
            </h1>
            <div className="flex flex-col gap-4 text-xs leading-[1.4] text-[var(--foreground-muted)] md:text-sm">
              <p>
                Every week, new AI tools, design resources, frameworks,
                articles, plugins, and workflows are released.
                It&rsquo;s exciting, but it also means the things that could
                make you a better designer quickly get buried. A tool you
                discovered last month, a brilliant product teardown you meant
                to revisit, or an AI workflow that saved you hours can easily
                disappear into bookmarks, browser tabs, or forgotten notes.
              </p>
              <p>
                I built Foundry because I wanted one place to collect the
                resources that actually matter. Instead of constantly
                searching for that article, template, prompt, or tool again,
                everything is organized and ready whenever I need it. Over
                time, it became more than a personal library, it became a
                curated knowledge base for product designers who want to
                spend less time searching and more time designing.
              </p>
              <p>
                Read the complete story{" "}
                <a
                  href={MEDIUM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] underline"
                >
                  here
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center gap-4">
            <h2 className="text-lg leading-[1.2] font-bold text-[var(--foreground)] md:text-[24px]">
              Stay updated &amp; Support the project
            </h2>
            <div className="flex flex-col gap-4 text-xs leading-[1.4] text-[var(--foreground-muted)] md:text-sm">
              <p>
                Foundry is now a community-driven project that I&rsquo;ll
                continue improving as new tools, resources, and ideas emerge.
                My goal is to keep it free and accessible to every product
                designer.
              </p>
              <p>
                If Foundry has helped you, you can support the project by
                contributing resources, sharing feedback, or{" "}
                <a
                  href="https://buymeacoffee.com/olaadedamo9?new=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] underline"
                >
                  buying me a coffee
                </a>{" "}
                to help keep it growing. ☕
              </p>
              <p>
                💡 Got feedback or suggestions? Send me an email on{" "}
                <a
                  href="mailto:Olaadedamola84@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] underline"
                >
                  Olaadedamola84@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
