import React from 'react';

interface ShareArrowIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
}

export const ShareArrowIcon: React.FC<ShareArrowIconProps> = ({
    size = 16,
    color = 'currentColor',
    className,
    style,
    ...props
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
            {...props}
        >
            <path
                d="M3.5 19.5C4 13.5 8 9 14 9V4.5L21.5 12L14 19.5V14.5C8.8 14.5 5.5 17 3.5 19.5Z"
                stroke={color}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ShareArrowIcon;
