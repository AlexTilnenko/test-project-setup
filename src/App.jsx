import { Field, Form, Formik } from "formik";
import { useEffect, useState, useRef } from "react";
import * as Yup from "yup";
import classNames from "classnames";
import "./App.scss";

//валидация входных данных
const AddUserSchema = Yup.object().shape({
	email: Yup.string().email("Некорректный email").required(" "),
	fullName: Yup.string().min(2).max(50).required(" "),
	phone: Yup.number().required(" "),
	password: Yup.string()
		.trim()
		.matches(
			/^(?=.*[0-9])(?=.*[a-z]).{8,20}$/g,
			"Пароль должен содержать минимум 6 символов включая хотя бы одну цифру"
		)
		.required(" "),
	status: Yup.string().required("Обязательное поле")
});

function App() {
	const tableHeaders = ["Почта", "Пароль", "ФИО", "Статус", "Телефон", "Создано", "Обновлено"];

	// создаю ссылку на окно попапа
	const popupRef = useRef();
	// флаг когда попап открыт
	const [visiblePopup, setVisiblePopup] = useState(false);

	const [users, setUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState({});

	// если кликнули вне всплывающего окна спрашиваем у пользователя и закрываем его
	const outsideClickHandle = (e) => {
		if (e.target === popupRef.current) {
			setVisiblePopup(false);
		}
	};

	useEffect(() => {
		const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
		setUsers(savedUsers);
	}, []);

	useEffect(() => {
		//инициализация materialize для работы селекта в форме
		window.M.AutoInit();
		window.M.updateTextFields();
		//вешаю обработчик клика что бы отследить клик вне всплывающего окна
		document.body.addEventListener("click", outsideClickHandle);
		//возвращаю колбэк что бы удалить обработчик при демонтировании компоненты
		return () => document.body.addEventListener("click", outsideClickHandle);
	});
	//добавляю ноль к числу меньше 10 для даты
	const zero = (num) => {
		return +num < 10 ? `0${num}` : num;
	};

	//добавляю нового пользователя или обновляю данные ранее созданного
	const saveUserHandler = (values) => {
		const date = new Date();
		const currentDate = `${zero(date.getDate())}.${zero(
			date.getMonth() + 1
		)}.${date.getFullYear()} ${zero(date.getHours())}:${zero(date.getMinutes())}`;

		const newUser = {
			id: values.id || Date.now(),
			...values,
			createTime: currentUser.createTime || currentDate,
			updateTime: currentDate
		};
		setUsers((state) => [...state, newUser]);
		localStorage.setItem("users", JSON.stringify(users));
	};
	//добавляю данные существующего пользователя в отдельный стейт что бы отобразить их в форме всплывающего окна
	const editUserHandler = (id) => {
		const currentUser = users.filter((user) => user.id === id);
		setCurrentUser(currentUser);
		setVisiblePopup(true);
	};
	console.log(users);

	return (
		<div className='App'>
			<div className='wrapper z-depth-1'>
				{users.length ? (
					<table className='striped user-table'>
						<thead>
							<tr>
								{tableHeaders.map((header, index) => (
									<th key={`${header}_${index}`}>{header}</th>
								))}
							</tr>
						</thead>

						<tbody>
							{users.map((user) => (
								<tr key={user.id}>
									<td>{user.email}</td>
									<td>{user.password}</td>
									<td>{user.fullName}</td>
									<td>{user.status}</td>
									<td>{user.phone}</td>
									<td>{user.createTime}</td>
									<td>{user.updateTime}</td>
									<td>
										<button
											className='btn mx-1 light-blue darken-3'
											onClick={() => editUserHandler(user.id)}
										>
											<i className='material-icons'>edit</i>
										</button>
										<button className='btn mx-1 red darken-3'>
											<i className='material-icons'>remove_circle</i>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div className='center-align'>Пока что нету ни одного пользователя</div>
				)}
				<button className='btn waves-effect  my-1' onClick={() => setVisiblePopup(true)}>
					Добавить пользователя
				</button>

				<div className={visiblePopup ? "popup active" : "popup"} ref={popupRef}>
					<div className='popup__body'>
						<span>Введите данные нового пользователя</span>
						<Formik
							initialValues={{
								id: currentUser.id || "",
								email: currentUser.email || "",
								password: currentUser.password || "",
								fullName: currentUser.fullName || "",
								phone: currentUser.phone || "",
								status: currentUser.status || ""
							}}
							onSubmit={(values, { resetForm }) => {
								saveUserHandler(values);
								resetForm({ values: "" });
							}}
							validationSchema={AddUserSchema}
						>
							{({ values, errors, touched }) => (
								<Form className='col'>
									<div className='row'>
										<div className='input-field col s12'>
											<Field
												id='fullName'
												type='text'
												value={values.fullName}
												className={classNames({
													invalid: errors.fullName && touched.fullName,
													valid: !errors.fullName && touched.fullName
												})}
											/>
											<label htmlFor='fullName'>* ФИО</label>
											<span className='helper-text' data-error={errors.fullName} />
										</div>
									</div>
									<div className='row'>
										<div className='input-field col s6 '>
											<Field
												id='email'
												type='text'
												value={values.email}
												className={classNames({
													invalid: errors.email && touched.email,
													valid: !errors.email && touched.email
												})}
											/>
											<label htmlFor='email'>* Почта</label>
											<span className='helper-text' data-error={errors.email} />
										</div>

										<div className='input-field col s6'>
											<Field
												id='password'
												type='text'
												value={values.password}
												className={classNames({
													invalid: errors.password && touched.password,
													valid: !errors.password && touched.password
												})}
											/>
											<label htmlFor='password'>* Пароль</label>
											<span className='helper-text' data-error={errors.password} />
										</div>
									</div>
									<div className='row'>
										<div className='input-field col s6'>
											<Field
												id='phone'
												type='text'
												value={values.phone}
												className={classNames({
													invalid: errors.phone && touched.phone,
													valid: !errors.phone && touched.phone
												})}
											/>
											<label htmlFor='phone'>* Телефон</label>
											<span className='helper-text' data-error={errors.phone} />
										</div>
										<div className='input-field col s6' value={values.status || ""}>
											<Field
												as='select'
												id='status'
												name='status'
												className={classNames({
													invalid: errors.status && touched.status,
													valid: !errors.status && touched.status
												})}
											>
												{!values.status && (
													<option value='' disabled>
														* Выберите тип пользователя
													</option>
												)}
												<option value='client'>client</option>
												<option value='partner'>partner</option>
												<option value='admin'>admin</option>
											</Field>
											<label htmlFor='status' className='invalid'>
												{errors.status}
											</label>
										</div>
									</div>
									<div className='row'>
										<div className='col'>
											<button className='btn mx-1' type='submit'>
												Сохранить
											</button>
											<button type='button' className='btn red darken-3 mx-1'>
												Отмена
											</button>
										</div>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
