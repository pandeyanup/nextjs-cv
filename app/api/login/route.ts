import { LoginValidator } from "@/lib/validator/secret";
import { z } from "zod";

export async function POST(req: Request) {
  const emailValue = process.env["EMAIL"];
  const passwordValue = process.env["PASSWORD"];
  try {
    const body = await req.json();
    const { email, password } = LoginValidator.parse(body);

    if (!email || !password) {
      return new Response("Please enter all data", { status: 403 });
    }

    if (password !== passwordValue || email !== emailValue) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (password === passwordValue && email === emailValue) {
      return new Response(JSON.stringify({ message: "Correct Secret Typed" }), {
        status: 200,
      });
    }

    return new Response("Unauthorized", { status: 401 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not process the request. Please try later", {
      status: 500,
    });
  }
}
