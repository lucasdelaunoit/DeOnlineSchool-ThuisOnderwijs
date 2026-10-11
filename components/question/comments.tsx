import { CommentForm } from "./comment-form";

export function Comments({ slug }: { slug: string }) {
  return (
    <section aria-labelledby="comment" className="section bg-sheet">
      <div className="container-text">
        <h2 id="comment" className="section-title">
          Reageren
        </h2>
        <p className="section-intro">Deel je ervaring of stel een vraag. We bekijken elke reactie voor ze verschijnt.</p>
        <CommentForm slug={slug} />
      </div>
    </section>
  );
}
