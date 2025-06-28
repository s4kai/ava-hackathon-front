import { Loader2 } from "lucide-react";

export const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="animate-spin ">
        <Loader2 className="w-20 h-20 text-muted-foreground" />
      </div>
    </div>
  );
};
