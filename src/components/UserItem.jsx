import React from "react";

function UserItem({ user, onEditUser, onRemoveUser }) {
	return (
		<tr>
			<td>{user.email}</td>
			<td>{user.password}</td>
			<td>{user.fullName}</td>
			<td>{user.status}</td>
			<td>{user.phone}</td>
			<td>{user.createTime}</td>
			<td>{user.updateTime}</td>
			<td>
				<button
					className='btn btn-small my-1 mx-1 light-blue darken-3'
					onClick={() => onEditUser(user.id)}
				>
					<i className='material-icons'>edit</i>
				</button>
				<button
					className='btn btn-small my-1 mx-1 red darken-3'
					onClick={() => onRemoveUser(user.id)}
				>
					<i className='material-icons'>remove_circle</i>
				</button>
			</td>
		</tr>
	);
}

export default UserItem;
