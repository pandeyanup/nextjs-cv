import EditPageButton from "@/components/EditPageButton";
import Login from "@/components/Login";
import Logout from "@/components/Logout";
import { getServerSession } from "next-auth";

type Props = {};

const Page = async (props: Props) => {
  const session = await getServerSession();
  if (session) {
    return (
      <div>
        <Logout />
        <EditPageButton />
      </div>
    );
  }

  return (
    <>
      <div className="flex px-4 justify-center items-center w-max h-auto space-x-3">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Login />
        </div>
      </div>
    </>
  );
};

export default Page;
