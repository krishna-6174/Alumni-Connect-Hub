import { SVGProps } from "react";
// ShowPassword Icon
const ShowPasswordIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => {
    const { width, height, fill, ...rest } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width ?? "24"}
            height={height ?? "24"}
            viewBox={`0 0 ${width ?? 24} ${height ?? 24}`}
            fill="none"
            {...rest}
        >
            <path
                d="M3.9074 8.65134C7.53762 2.44955 16.4624 2.44955 20.0926 8.65134C21.3025 10.7182 21.3025 13.2818 20.0926 15.3487C16.4624 21.5504 7.53762 21.5504 3.9074 15.3487C2.69753 13.2818 2.69753 10.7182 3.9074 8.65134Z"
                stroke={fill ?? "#B8B8B8"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.5567 12.0607C15.5567 14.0561 13.9637 15.6733 11.9994 15.6733C10.0352 15.6733 8.44336 14.0561 8.44336 12.0607C8.44336 10.0641 10.0352 8.44699 11.9994 8.44699C13.9637 8.44699 15.5567 10.0641 15.5567 12.0607Z"
                stroke={fill ?? "#B8B8B8"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

// HidePassword Icon
const HidePasswordIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => {
    const { width, height, fill, ...rest } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width ?? "24"}
            height={height ?? "24"}
            viewBox={`0 0 ${width ?? 24} ${height ?? 24}`}
            fill="none"
            {...rest}
        >
            <path
                d="M20.7399 8.27246C20.5306 7.91498 20.0712 7.79482 19.7137 8.00407C19.3563 8.21332 19.2361 8.67274 19.4453 9.03021L20.7399 8.27246ZM9.16464 18.7776C8.77298 18.6427 8.34619 18.851 8.21137 19.2426C8.07656 19.6343 8.28478 20.0611 8.67645 20.1959L9.16464 18.7776ZM13.9162 9.96831C14.216 10.2542 14.6907 10.2429 14.9766 9.94318C15.2624 9.64343 15.2512 9.16869 14.9514 8.88282L13.9162 9.96831ZM8.7432 14.9157C9.01234 15.2305 9.48577 15.2676 9.80062 14.9985C10.1155 14.7293 10.1525 14.2559 9.8834 13.941L8.7432 14.9157ZM16.3067 12.0607C16.3067 11.6465 15.9709 11.3107 15.5567 11.3107C15.1425 11.3107 14.8067 11.6465 14.8067 12.0607H16.3067ZM11.9994 14.9233C11.5852 14.9233 11.2494 15.2591 11.2494 15.6733C11.2494 16.0875 11.5852 16.4233 11.9994 16.4233V14.9233ZM20.4095 4.52614C20.7001 4.23095 20.6963 3.75609 20.4011 3.46551C20.1059 3.17493 19.6311 3.17867 19.3405 3.47386L20.4095 4.52614ZM4.15301 18.9024C3.86243 19.1976 3.86617 19.6725 4.16136 19.9631C4.45655 20.2536 4.93141 20.2499 5.22199 19.9547L4.15301 18.9024ZM19.4453 9.03021C20.5182 10.8631 20.5182 13.1369 19.4453 14.9698L20.7399 15.7275C22.0867 13.4266 22.0867 10.5734 20.7399 8.27246L19.4453 9.03021ZM19.4453 14.9698C17.2217 18.7686 12.8404 20.0427 9.16464 18.7776L8.67645 20.1959C12.9744 21.6752 18.1274 20.1907 20.7399 15.7275L19.4453 14.9698ZM4.55466 14.9698C3.48178 13.1369 3.48178 10.8631 4.55466 9.03021L3.26013 8.27246C1.91329 10.5734 1.91329 13.4266 3.26013 15.7275L4.55466 14.9698ZM6.45255 17.2388C5.72734 16.6258 5.08181 15.8704 4.55466 14.9698L3.26013 15.7275C3.87315 16.7748 4.62893 17.6614 5.48415 18.3843L6.45255 17.2388ZM4.55466 9.03021C7.26824 4.3944 13.2017 3.51996 17.1232 6.42527L18.0162 5.22C13.4173 1.81293 6.44922 2.8243 3.26013 8.27246L4.55466 9.03021ZM9.19331 12.0607C9.19331 10.467 10.4606 9.19699 11.9994 9.19699V7.69699C9.60973 7.69699 7.69331 9.66125 7.69331 12.0607H9.19331ZM11.9994 9.19699C12.7392 9.19699 13.4126 9.48802 13.9162 9.96831L14.9514 8.88282C14.1822 8.14925 13.1429 7.69699 11.9994 7.69699V9.19699ZM9.8834 13.941C9.45402 13.4387 9.19331 12.7825 9.19331 12.0607H7.69331C7.69331 13.1505 8.08864 14.15 8.7432 14.9157L9.8834 13.941ZM14.8067 12.0607C14.8067 13.6528 13.5387 14.9233 11.9994 14.9233V16.4233C14.3887 16.4233 16.3067 14.4595 16.3067 12.0607H14.8067ZM19.3405 3.47386L4.15301 18.9024L5.22199 19.9547L20.4095 4.52614L19.3405 3.47386Z"
                fill={fill ?? "#B8B8B8"}
            />
        </svg>
    );
};

// Search Icon
const SearchIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => {
    const { width, height, fill, ...rest } = props;
    return (
        <svg
            width={width ?? "20"}
            height={height ?? "20"}
            viewBox={`0 0 ${width ?? 20} ${height ?? 20}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <path
                d="M2.76311 11.4842L3.49329 11.3129L2.76311 11.4842ZM2.76311 6.93667L3.49329 7.10794L2.76311 6.93667ZM15.6578 6.93667L16.3879 6.76539L15.6578 6.93667ZM15.6578 11.4842L16.3879 11.6555L15.6578 11.4842ZM11.4842 15.6578L11.3129 14.9276L11.4842 15.6578ZM6.93667 15.6578L6.76539 16.3879L6.93667 15.6578ZM6.93667 2.76311L6.76539 2.03293V2.03293L6.93667 2.76311ZM11.4842 2.76311L11.6555 2.03293L11.4842 2.76311ZM16.9697 18.0303C17.2626 18.3232 17.7374 18.3232 18.0303 18.0303C18.3232 17.7374 18.3232 17.2626 18.0303 16.9697L16.9697 18.0303ZM3.49329 11.3129C3.1689 9.93004 3.1689 8.49084 3.49329 7.10794L2.03293 6.76539C1.65569 8.3736 1.65569 10.0473 2.03293 11.6555L3.49329 11.3129ZM14.9276 7.10795C15.252 8.49084 15.252 9.93004 14.9276 11.3129L16.3879 11.6555C16.7652 10.0473 16.7652 8.3736 16.3879 6.76539L14.9276 7.10795ZM11.3129 14.9276C9.93004 15.252 8.49084 15.252 7.10795 14.9276L6.76539 16.3879C8.3736 16.7652 10.0473 16.7652 11.6555 16.3879L11.3129 14.9276ZM7.10794 3.49329C8.49084 3.1689 9.93004 3.1689 11.3129 3.49329L11.6555 2.03293C10.0473 1.65569 8.3736 1.65569 6.76539 2.03293L7.10794 3.49329ZM7.10795 14.9276C5.31441 14.5069 3.914 13.1065 3.49329 11.3129L2.03293 11.6555C2.58373 14.0037 4.41721 15.8371 6.76539 16.3879L7.10795 14.9276ZM11.6555 16.3879C14.0037 15.8371 15.8371 14.0037 16.3879 11.6555L14.9276 11.3129C14.5069 13.1065 13.1065 14.5069 11.3129 14.9276L11.6555 16.3879ZM11.3129 3.49329C13.1065 3.91399 14.5069 5.31441 14.9276 7.10795L16.3879 6.76539C15.8371 4.41721 14.0037 2.58373 11.6555 2.03293L11.3129 3.49329ZM6.76539 2.03293C4.41721 2.58373 2.58373 4.41721 2.03293 6.76539L3.49329 7.10794C3.914 5.3144 5.31441 3.91399 7.10794 3.49329L6.76539 2.03293ZM13.9156 14.9763L16.9697 18.0303L18.0303 16.9697L14.9763 13.9156L13.9156 14.9763Z"
                fill={fill ?? "#363853"}
            />
        </svg>
    );
};

export { ShowPasswordIcon, HidePasswordIcon, SearchIcon };
