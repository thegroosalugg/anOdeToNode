import { ButtonHTMLAttributes } from "react";

export default function Button({
    styled,
  children,
  ...props
}: {
   styled?: boolean;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = styled ? { color: 'white', background: 'var(--party-purple)' } : {};

  return (
    <button style={{ ...styles, minWidth: 76, padding: '0 0.5rem' }} {...props}>
      {children}
    </button>
  );
}
