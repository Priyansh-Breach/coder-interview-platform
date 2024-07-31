import { FrownIcon } from "lucide-react";

export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 md:py-24">
        <div className="relative h-32 w-32 ">
        <FrownIcon className="mx-auto h-32 w-12 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl">No Results Found</h2>
          <p className="mt-2 text-muted-foreground md:text-lg">
            It looks like we couldn't find what you were looking for. Please try a different search.
          </p>
        </div>
      </div>
    )
  }