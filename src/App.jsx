import { useEffect, useState } from "react";
import "./App.scss";
import Popup from "./components/Popup";
import TableHeader from "./components/TableHeader";
import UserItem from "./components/UserItem";
import { addZero, filterByParam, filterByTerm } from "./utils";

function App() {
	// флаг когда попап открыт
	const [visiblePopup, setVisiblePopup] = useState(false);

	const [users, setUsers] = useState([]);
	//данные текущего пользователя для редактирования
	const [currentUser, setCurrentUser] = useState({});
	const [visibleUsers, setVisibleUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [userStatus, setUserStatus] = useState("");

	useEffect(() => {
		//получаю начальные данные из localStorage
		const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
		setUsers(savedUsers);
		setVisibleUsers(savedUsers);
	}, []);

	//обновляю данные пользователей в localStorage каждый раз когда изменяются users
	useEffect(() => {
		if (users.length > 0) {
			localStorage.setItem("users", JSON.stringify(users));
			setVisibleUsers(users);
		}
		//инициализация materialize select
		window.M.AutoInit();
	}, [users]);

	//добавляю нового пользователя или обновляю данные ранее созданного
	const saveUserHandler = (values, reset) => {
		const date = new Date();
		const currentDate = `${addZero(date.getDate())}.${addZero(
			date.getMonth() + 1
		)}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;

		const newUser = {
			...values,
			id: values.id || Date.now(),
			createTime: currentUser.createTime || currentDate,
			updateTime: currentDate
		};
		const index = users.findIndex((user) => user.id === values.id);
		setUsers((state) =>
			index !== -1
				? [...state.slice(0, index), newUser, ...state.slice(index + 1)]
				: [...state, newUser]
		);
		setVisiblePopup(false);
		setCurrentUser({});
		reset();
	};

	const closePopup = (reset) => {
		if (window.confirm("Все данные будут удалены! Вы уверены что хотите закрыть окно?")) {
			setVisiblePopup(false);
			reset();
			setCurrentUser({});
		}
	};

	//добавляю данные существующего пользователя в отдельный стейт что бы отобразить их в форме всплывающего окна
	const editUserHandler = (id) => {
		//добавляю данные текущего пользователя в стейт, что бы вывести их в форме редактирвания
		const currentUser = filterByParam(users, id, "id", true);
		setCurrentUser(currentUser[0]);
		setVisiblePopup(true);
		//обновляю все инпуты формы
		window.M.AutoInit();
		window.M.updateTextFields();
	};

	const removeUserHandler = (id) => {
		//после подтверждения удаляю выбраного пользователя
		if (window.confirm("Вы уверены, что хотите безвозвратно удалить запись?")) {
			setUsers((state) => {
				return filterByParam(state, id, "id", false);
			});
		}
	};
	//поиск почты или телефона среди пользователей
	const searchUserHandler = (data, term) => {
		switch (true) {
			case term === "":
				return data;
			case !isNaN(+term):
				return filterByTerm(data, "phone", term);
			case isNaN(+term):
				return filterByTerm(data, "email", term);
			default:
				return data;
		}
	};
	//фильрация пользователей по статусу
	const filterUsers = () => {
		if (!userStatus) {
			return users;
		} else {
			return filterByParam(users, userStatus, "status", true);
		}
	};
	//изменяю видимых пользователей если меняется статус или строка поиска
	useEffect(() => {
		setVisibleUsers(searchUserHandler(filterUsers(), searchTerm));
	}, [searchTerm, userStatus]);

	return (
		<div className='App'>
			<div className='wrapper z-depth-1'>
				<div className='search-field'>
					<input
						className='search-input'
						type='text'
						placeholder='Введите телефон или адрес эл. почты'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				{users.length ? (
					<table className='striped user-table'>
						<TableHeader onChangeStatus={setUserStatus} userStatus={userStatus} />

						<tbody>
							{visibleUsers.map((user) => (
								<UserItem
									key={user.id}
									user={user}
									onEditUser={editUserHandler}
									onRemoveUser={removeUserHandler}
								/>
							))}
						</tbody>
					</table>
				) : (
					<div className='center-align'>
						<h4>Пока что нету ни одного пользователя</h4>
					</div>
				)}
				<button
					className='btn waves-effect  mt-1'
					onClick={() => {
						setVisiblePopup(true);
						window.M.AutoInit();
					}}
				>
					Добавить пользователя
				</button>
				<Popup
					users={users}
					currentUser={currentUser}
					onUserSave={saveUserHandler}
					closePopup={closePopup}
					visiblePopup={visiblePopup}
				/>
			</div>
		</div>
	);
}

export default App;
