type UserCardProps = {
  id: string;
  name: string;
  onActionClick: () => void;
};

export function UserCard({ id, name, onActionClick }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>ID: {id}</p>
      <button type="button" onClick={onActionClick}>
        Perform Action
      </button>
    </div>
  );
}
