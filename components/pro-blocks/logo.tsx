import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ width = 180, height = 45, className = "" }) => {
  return (
    <Image
      src="/image.png"
      alt="AcquiSmart Logo"
      width={width}
      height={height}
      className={`${className} h-8 md:h-10 w-auto`}
      priority
    />
  );
};
