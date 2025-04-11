export const Button = ({ children, ...props }) => (
  <button className="px-4 py-2 border rounded" {...props}>{children}</button>
);