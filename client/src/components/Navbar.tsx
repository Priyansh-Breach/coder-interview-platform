import { Package2 } from "lucide-react";
import { FeedbackForm } from "./Feedback";
import { ProfileComponent } from "./ProfileComponent";

export function Navbar() {
  return (
    <div>
      <header className=" fixed w-full z-[30] backdrop-blur-lg backdrop-filter bg-opacity-50 top-0 flex h-16 items-center gap-4 border-b  px-4 md:px-6">
        <nav className=" flex-row gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <a
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
          </a>
          <FeedbackForm />
        </nav>

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative"></div>
          </form>
          <ProfileComponent />
        </div>
      </header>
    </div>
  );
}
