"use client";

import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { signInAdmin, type SignInState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SignInState = { error: null };

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(
    signInAdmin,
    initialState
  );

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      toast.error("Cont neautorizat.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <Card className="w-full max-w-sm ring-0">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl tracking-tight">
          FitEducation Admin
        </CardTitle>
        <CardDescription>Conectează-te pentru a continua.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              placeholder="admin@fiteducationschool.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Parolă</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="mt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-accent-primary text-white hover:bg-accent-hover"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Se conectează…
              </>
            ) : (
              "Conectare"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
