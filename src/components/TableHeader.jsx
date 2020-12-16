import React from "react";

const tableHeaders = ["Почта", "Пароль", "ФИО", "Статус", "Телефон", "Создано", "Обновлено"];

function TableHeader({ onChangeStatus, userStatus }) {
	return (
		<thead>
			<tr>
				{tableHeaders.map((header, index) => {
					if (header === "Статус") {
						return (
							<th key={`${header}_${index}`}>
								<div className='input-field col'>
									<select
										onChange={(e) => onChangeStatus(e.target.value)}
										className='filter-select'
										value={userStatus}
									>
										<option value=''>Все пользователи</option>
										<option value='client'>client</option>
										<option value='partner'>partner</option>
										<option value='admin'>admin</option>
									</select>
								</div>
							</th>
						);
					} else {
						return <th key={`${header}_${index}`}>{header}</th>;
					}
				})}
			</tr>
		</thead>
	);
}

export default TableHeader;
