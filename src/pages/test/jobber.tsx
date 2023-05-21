import { Button } from "@mui/material";
import { useRouter } from "next/router";

const clientId = "f738dd01-069b-4049-a94d-33fabc533306";

const jobberAuthLink = () =>
  `https://api.getjobber.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=${`localhost:3000/api/auth/callback/jobber`}&state=${`test`}`;

export default function Page() {
  const router = useRouter();

  return (
    <div>
      <Button
        onClick={() => {
          router.push(jobberAuthLink()).catch((e) => {
            console.log(e);
          });
        }}
      >
        Login with Jobber
      </Button>
    </div>
  );
}
