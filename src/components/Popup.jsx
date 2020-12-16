import React from "react";
import { Field, Form, Formik } from "formik";
import classNames from "classnames";
import * as Yup from "yup";

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

function Popup({ currentUser, onUserSave, closePopup, visiblePopup }) {
	return (
		<div className={visiblePopup ? "popup active" : "popup"}>
			<div className='popup__body'>
				<Formik
					enableReinitialize={true}
					initialValues={{
						id: currentUser.id || "",
						email: currentUser.email || "",
						password: currentUser.password || "",
						fullName: currentUser.fullName || "",
						phone: currentUser.phone || "",
						status: currentUser.status || ""
					}}
					onSubmit={(values, { resetForm }) => {
						onUserSave(values, () => resetForm({ values: "" }));
					}}
					validationSchema={AddUserSchema}
				>
					{({ values, errors, touched, resetForm }) => (
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
									<label htmlFor='fullName' className={visiblePopup ? "active" : ""}>
										* ФИО
									</label>
									<span className='helper-text' data-error={errors.fullName} />
								</div>
							</div>
							<div className='row'>
								<div className='input-field col s6'>
									<Field
										id='email'
										type='text'
										value={values.email}
										className={classNames({
											invalid: errors.email && touched.email,
											valid: !errors.email && touched.email
										})}
									/>
									<label htmlFor='email' className={visiblePopup ? "active" : ""}>
										* Почта
									</label>
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
									<label htmlFor='password' className={visiblePopup ? "active" : ""}>
										* Пароль
									</label>
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
									<label htmlFor='phone' className={visiblePopup ? "active" : ""}>
										* Телефон
									</label>
									<span className='helper-text' data-error={errors.phone} />
								</div>
								<div className='input-field col s6'>
									<Field
										component='select'
										id='status'
										name='status'
										value={values.status}
										className='browser-default'
									>
										<option value='' disabled>
											Выберите роль пользователя
										</option>
										<option value='client'>client</option>
										<option value='partner'>partner</option>
										<option value='admin'>admin</option>
									</Field>
								</div>
							</div>
							<div className='row'>
								<div className='col'>
									<button className='btn mx-1' type='submit'>
										Сохранить
									</button>
									<button
										type='button'
										className='btn red darken-3 mx-1'
										onClick={() => {
											closePopup(() => resetForm({ values: "" }));
										}}
									>
										Отмена
									</button>
								</div>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export default Popup;
