export default function UserList({ usersInRoom }) {
  console.log(usersInRoom);
  return (
    <>
      {usersInRoom.map((user, index) => {
        console.log(`Rendering user ${index}:`, user.user.name);
        return <p key={index}>{user.user.name}</p>;
      })}
    </>
  );
}
