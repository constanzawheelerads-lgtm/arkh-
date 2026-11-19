// Minimal Deno globals so the Edge Function can be type-checked with Node's tsc.
// The real types come from the Deno runtime when deployed.
declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};
