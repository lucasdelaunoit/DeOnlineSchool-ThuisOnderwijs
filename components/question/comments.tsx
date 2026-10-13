import { CommentForm } from "./comment-form";

export function Comments({ slug }: { slug: string }) {
  return (
    <section aria-labelledby="comment" className="pb-16 md:pb-24">
      <div className="container-wide">
        <div className="section-rule">
          <h2 id="comment" className="section-title">
            Reageren
          </h2>
          <p className="section-intro">Deel je ervaring of stel een vraag. We bekijken elke reactie voor ze verschijnt.</p>
          <div className="reveal mt-6">
            <CommentForm slug={slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
