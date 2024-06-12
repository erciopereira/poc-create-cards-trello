interface ButtonSelectProps {
  name: string;
}

export function ButtonSelect({ name }: ButtonSelectProps) {
  return <button>{name}</button>;
}
