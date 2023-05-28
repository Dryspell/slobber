import { Button } from "@mui/material";
import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <div>
      <Button
        onClick={() => {
          signIn("jobber").catch((e) => {
            console.log(e);
          });
        }}
      >
        Login with Jobber
      </Button>
    </div>
  );
}
