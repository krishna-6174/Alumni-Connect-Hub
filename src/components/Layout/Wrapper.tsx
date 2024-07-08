import React from "react";

interface WrapperProps {
	children: React.ReactNode;
	className?: string;
}

const Wrapper: React.FC<WrapperProps> = ({
	children,
	className = "",
}: WrapperProps): JSX.Element => {
	return <div className={className}>{children}</div>;
};

export default Wrapper;
