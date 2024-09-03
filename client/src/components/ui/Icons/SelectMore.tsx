export const SelectMore = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    className="injected-svg "
    data-src="https://cdn.hugeicons.com/icons/drag-drop-vertical-bulk-rounded.svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    role="img"
  >
    <path
      opacity="0.4"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.9937 6C13.9937 4.89543 14.8891 4 15.9937 4H16C17.1046 4 18 4.89543 18 6C18 7.10457 17.1046 8 16 8H15.9937C14.8891 8 13.9937 7.10457 13.9937 6ZM6 12C6 10.8954 6.89543 10 8 10H8.00635C9.11092 10 10.0063 10.8954 10.0063 12C10.0063 13.1046 9.11092 14 8.00635 14H8C6.89543 14 6 13.1046 6 12ZM13.9937 18C13.9937 16.8954 14.8891 16 15.9937 16H16C17.1046 16 18 16.8954 18 18C18 19.1046 17.1046 20 16 20H15.9937C14.8891 20 13.9937 19.1046 13.9937 18Z"
      fill="#000000"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6 6C6 4.89543 6.89543 4 8 4H8.00635C9.11092 4 10.0063 4.89543 10.0063 6C10.0063 7.10457 9.11092 8 8.00635 8H8C6.89543 8 6 7.10457 6 6ZM13.9937 12C13.9937 10.8954 14.8891 10 15.9937 10H16C17.1046 10 18 10.8954 18 12C18 13.1046 17.1046 14 16 14H15.9937C14.8891 14 13.9937 13.1046 13.9937 12ZM6 18C6 16.8954 6.89543 16 8 16H8.00635C9.11092 16 10.0063 16.8954 10.0063 18C10.0063 19.1046 9.11092 20 8.00635 20H8C6.89543 20 6 19.1046 6 18Z"
      fill="#000000"
    ></path>
  </svg>
);

export function BadgeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    </svg>
  );
}

export function CodeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function ReplyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

export function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export const LoadingIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      role="img"
    >
      <path
        d="M12 3V6"
        className="stroke-current text-black dark:text-white"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M12 18V21"
        className="stroke-current text-black dark:text-white"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M21 12H18"
        className="stroke-current text-black dark:text-white"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M6 12H3"
        className="stroke-current text-black dark:text-white"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M18.3635 5.63672L16.2422 7.75804"
        className="stroke-current text-black dark:text-white"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M7.75804 16.2422L5.63672 18.3635"
        className="stroke-current text-black dark:text-white"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M18.3635 18.3635L16.2422 16.2422"
        className="stroke-current text-black dark:text-white"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M7.75804 7.75804L5.63672 5.63672"
        className="stroke-current text-black dark:text-white"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
    </svg>
  );
};

export const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    className="injected-svg h-4 w-4 mr-2"
    data-src="https://cdn.hugeicons.com/icons/user-stroke-sharp.svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    role="img"
  >
    <path
      d="M3 22H21C21 17.5817 16.9706 14 12 14C7.02944 14 3 17.5817 3 22Z"
      stroke="#ffffff"
      stroke-width="1.5"
    ></path>
    <path
      d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
      stroke="#ffffff"
      stroke-width="1.5"
    ></path>
  </svg>
);

export const ExploreIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 16 16"
    className="injected-svg h-4 w-4 mr-2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      d="M2.5 6.5V2.5H5.5V6.5H2.5ZM1 2C1 1.44772 1.44772 1 2 1H6C6.55228 1 7 1.44772 7 2V7C7 7.55228 6.55228 8 6 8H2C1.44772 8 1 7.55228 1 7V2ZM2.5 13.5V11.5H5.5V13.5H2.5ZM1 11C1 10.4477 1.44772 10 2 10H6C6.55228 10 7 10.4477 7 11V14C7 14.5523 6.55228 15 6 15H2C1.44772 15 1 14.5523 1 14V11ZM10.5 2.5V4.5H13.5V2.5H10.5ZM10 1C9.44772 1 9 1.44772 9 2V5C9 5.55228 9.44772 6 10 6H14C14.5523 6 15 5.55228 15 5V2C15 1.44772 14.5523 1 14 1H10ZM13.5 13.5H10.5V9.5H13.5V13.5ZM9 9C9 8.44772 9.44772 8 10 8H14C14.5523 8 15 8.44772 15 9V14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14V9Z"
      fill="#666666"
      fill-rule="evenodd"
    ></path>
  </svg>
);

export const TableOfContents = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-table-of-contents"
  >
    <path d="M16 12H3" />
    <path d="M16 18H3" />
    <path d="M16 6H3" />
    <path d="M21 12h.01" />
    <path d="M21 18h.01" />
    <path d="M21 6h.01" />
  </svg>
);

export const LogoutIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 16 16"
    className="injected-svg h-4 w-4 mr-2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      d="M2.5 13.5H6.75V15H2C1.44772 15 1 14.5523 1 14V2C1 1.44771 1.44772 1 2 1H6.75V2.5L2.5 2.5L2.5 13.5ZM12.4393 7.24999L10.4697 5.28031L9.93934 4.74998L11 3.68932L11.5303 4.21965L14.6036 7.29288C14.9941 7.6834 14.9941 8.31657 14.6036 8.70709L11.5303 11.7803L11 12.3106L9.93934 11.25L10.4697 10.7197L12.4393 8.74999L5.75 8.74999H5V7.24999H5.75L12.4393 7.24999Z"
      fill="#666666"
      fill-rule="evenodd"
    ></path>
  </svg>
);

export const SpeakingAIIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="injected-svg h-4 w-4"
    data-src="https://cdn.hugeicons.com/icons/voice-stroke-sharp.svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    role="img"
  >
    <path
      d="M3 21H21V3H3V21Z"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linejoin="round"
    ></path>
    <path
      d="M12 7V17"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linejoin="round"
    ></path>
    <path
      d="M9 9V15"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linejoin="round"
    ></path>
    <path
      d="M6 11V13"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linejoin="round"
    ></path>
    <path
      d="M15 9V15"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linejoin="round"
    ></path>
    <path
      d="M18 11V13"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linejoin="round"
    ></path>
  </svg>
);

export const RightDownIcon = () => (
  <svg
    width="calc(1rem * 1)"
    height="calc(1rem * 1)"
    viewBox="0 0 16 16"
    className="text-white dark:text-white"
  >
    <path d="M12.4715 11.8073L9.8055 14.4733C9.7435 14.5353 9.67022 14.584 9.58822 14.618C9.50688 14.652 9.42016 14.6693 9.3335 14.6693C9.24683 14.6693 9.16011 14.6513 9.07878 14.618C8.99678 14.584 8.92349 14.5353 8.86149 14.4733L6.19548 11.8073C5.93481 11.5466 5.93481 11.1252 6.19548 10.8646C6.45614 10.6039 6.87752 10.6039 7.13818 10.8646L8.66683 12.3932V4.0026C8.66683 3.26727 8.06883 2.66927 7.3335 2.66927H4.00016C3.6315 2.66927 3.3335 2.3706 3.3335 2.0026C3.3335 1.6346 3.6315 1.33594 4.00016 1.33594H7.3335C8.80416 1.33594 10.0002 2.53194 10.0002 4.0026V12.3932L11.5288 10.8646C11.7895 10.6039 12.2109 10.6039 12.4715 10.8646C12.7322 11.1252 12.7322 11.5466 12.4715 11.8073Z"></path>
  </svg>
);

export const LeftDownIcon = () => (
  <svg
    width="calc(1rem * 1)"
    height="calc(1rem * 1)"
    viewBox="0 0 16 16"
  >
    <path d="M12.6665 2.0026C12.6665 2.3706 12.3685 2.66927 11.9999 2.66927H8.66653C7.9312 2.66927 7.3332 3.26727 7.3332 4.0026V12.3932L8.86184 10.8646C9.12251 10.6039 9.54388 10.6039 9.80455 10.8646C10.0652 11.1253 10.0652 11.5466 9.80455 11.8073L7.13853 14.4733C7.07653 14.5353 7.00325 14.584 6.92125 14.618C6.83992 14.652 6.7532 14.6693 6.66653 14.6693C6.57986 14.6693 6.49314 14.6513 6.41181 14.618C6.32981 14.584 6.25652 14.5353 6.19452 14.4733L3.52851 11.8073C3.26784 11.5466 3.26784 11.1253 3.52851 10.8646C3.78917 10.6039 4.21055 10.6039 4.47122 10.8646L5.99986 12.3932V4.0026C5.99986 2.53194 7.19586 1.33594 8.66653 1.33594H11.9999C12.3685 1.33594 12.6665 1.6346 12.6665 2.0026Z"></path>
  </svg>
);
