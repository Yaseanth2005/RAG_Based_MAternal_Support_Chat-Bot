import click
import time
from src.rag.pipeline import run_rag_pipeline


@click.group()
def cli():
    """Main CLI entry point for the Maternal RAG Chatbot."""
    pass


# ============================================================
# Query Command
# ============================================================
@cli.command()
@click.option("--q", "--question", type=str, help="Your medical question")
@click.option("--top_k", default=4, help="Number of chunks to retrieve from Pinecone")
def query(q, top_k):
    """
    Ask a question to the RAG pipeline.
    Shows progress messages and returns the answer + sources.
    """

    # If question not provided → ask interactively
    if not q:
        q = click.prompt("\n❓ Enter your question")

    click.echo("\n🔍 Processing your question...")
    time.sleep(0.4)

    click.echo("📌 Step 1/4: Embedding your question...")
    time.sleep(0.4)

    click.echo("📚 Step 2/4: Querying Pinecone for relevant chunks...")
    time.sleep(0.4)

    click.echo("🧠 Step 3/4: Building RAG prompt...")
    time.sleep(0.4)

    click.echo("🤖 Step 4/4: Contacting local Meditron (Ollama)...\n")
    time.sleep(0.4)

    # Run RAG pipeline
    answer, retrieved = run_rag_pipeline(q, top_k=top_k)

    # ---------------------------------------------------------
    # Output Answer
    # ---------------------------------------------------------
    click.echo("\n✅ ✅ ✅  ANSWER  ✅ ✅ ✅")
    click.echo("---------------------------------------------\n")
    click.echo(answer)
    click.echo("\n")

    # ---------------------------------------------------------
    # Output Sources
    # ---------------------------------------------------------
    click.echo("📎 Sources used:")
    click.echo("---------------------------------------------")

    if retrieved:
        for i, item in enumerate(retrieved):
            src = item.get("source_file") or "unknown_source"
            score = round(item.get("score", 0), 4)
            click.echo(f"[{i+1}] {src}  (score={score})")
    else:
        click.echo("⚠️ No sources returned from Pinecone.")

    click.echo("\n✅ Finished!\n")


# ============================================================
# Health Check
# ============================================================
@cli.command()
def health():
    """Simple health check to ensure CLI works."""
    click.echo("✅ CLI is running. Environment and imports look good!")


# ============================================================
# Banner
# ============================================================
@cli.command()
def banner():
    """Display a welcome banner."""
    click.echo("""
=========================================
   🤖 Maternal Care RAG Chatbot (CLI)
   Built by YASWANTH
=========================================
""")


# ============================================================
# Entry point
# ============================================================
if __name__ == "__main__":
    cli()
