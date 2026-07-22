const MEDIUM_URL =
  "https://medium.com/@adedamolaola/simplifying-the-design-process-with-design-in-a-box-1741139a4e1a";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center justify-center px-6 py-8 md:px-20 md:py-20">
        <div className="flex w-full max-w-[848px] flex-col gap-8 md:gap-[62px]">
          <div className="flex flex-col items-start justify-center gap-4">
            <h1 className="text-2xl leading-[1.2] font-bold text-[var(--foreground)] md:text-[32px]">
              Why i built Foundry
            </h1>
            <div className="flex flex-col gap-4 text-sm leading-[1.2] text-[var(--foreground-muted)] md:text-lg">
              <p>
                One common challenge in the design process is managing tight
                project timelines, especially when collaborating with
                stakeholders. These constraints often lead to cutting
                corners — sometimes skipping important steps like user
                research, product strategy, competitor analysis, etc. While
                these steps are necessary for the success of a product, the
                pressure to deliver quickly can leave gaps in the process.
              </p>
              <p>
                To address this, I&rsquo;ve leaned on templates as a key
                strategy. Templates allow me to jump right into the work
                without reinventing the wheel for each project. For instance,
                if I&rsquo;m conducting user interviews, having a pre-made
                template for documenting feedback saves me time and ensures I
                don&rsquo;t overlook anything important.
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
            <h2 className="text-2xl leading-[1.2] font-bold text-[var(--foreground)] md:text-[32px]">
              Stay updated &amp; Support the project
            </h2>
            <div className="flex flex-col gap-4 text-sm leading-[1.2] text-[var(--foreground-muted)] md:text-lg">
              <p>
                I&rsquo;ll do my best to keep Foundry updated. If you find it
                useful, you can contribute or support the project by buying
                me a coffee. ☕
              </p>
              <p>
                💡 Got feedback or suggestions? Stay up to date with new
                submissions on X and share your thoughts!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
