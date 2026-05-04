import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Header() {
    return (
        <header className="flex justify-end items-center p-4 h-10 border-b">
                  {/* DESKTOP ONLY BUTTONS */}
                  <div className="hidden md:flex items-center gap-4">
                    <Show when="signed-out">
                      <SignInButton mode="modal">
                        <Button className="bg-slate-700 text-white rounded-full font-medium text-sm px-4 h-10 cursor-pointer hover:bg-slate-600 transition">
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button className="bg-purple-700 text-white rounded-full font-medium text-sm px-4 h-10 cursor-pointer hover:bg-purple-600 transition">
                          Sign Up
                        </Button>
                      </SignUpButton>
                    </Show>
                  </div>

                  {/* USER BUTTON (Visible on all screens) */}
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </header>
    );
}