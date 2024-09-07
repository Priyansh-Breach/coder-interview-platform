import { Dribbble, Facebook, Linkedin, X } from "lucide-react";

export default function Profile() {
  return (
    <div className="group flex h-52 w-52 flex-col items-center justify-center rounded-3xl dark:border-zinc-700  p-4 shadow-sm transition-all duration-300 shadow-sm shadow-black/15 bg-muted">
      <img
        alt=""
        src="https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg"
        className="h-16 w-16 rounded-full"
      />
      <div className="mt-2 flex flex-col items-center justify-center">
        <h3 className="font-sans font-semibold text-foreground">Avatar Aang</h3>
        <p className="text-sm font-light text-muted-foreground">The last air bender</p>
      </div>
      <div className="mt-2 flex w-full flex-row justify-evenly rounded-3xl bg-background/70 p-2 text-foreground dark:bg-background/25">
        <a href="https://x.com/?lang=en&mx=2" target="_blank" rel="noopener noreferrer">
          <X size={18} className="transition-transform duration-300 hover:scale-110" />
        </a>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
          <Linkedin size={16} className="transition-transform duration-300 hover:scale-110" />
        </a>
        <a href="https://dribbble.com/" target="_blank" rel="noopener noreferrer">
          <Dribbble size={16} className="transition-transform duration-300 hover:scale-110" />
        </a>
        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
          <Facebook size={16} className="duration-300 hover:scale-110" />
        </a>
      </div>
    </div>
  );
}
