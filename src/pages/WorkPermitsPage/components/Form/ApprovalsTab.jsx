import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomSelect from "../../../../ui/CustomSelect/CustomSelect";

const ApprovalsTab = ({ getValues, control, everyoneExceptEmployees }) => {
	const currentUser = useSelector((state) => state.currentUser?.user);
	const [managerExecutors, setManagerExecutors] = useState([
		{
			id: currentUser.id,
			title: currentUser.last_name + " " + currentUser.first_name,
		},
	]);

	useEffect(() => {
		const selectedManager = everyoneExceptEmployees.find(
			(person) => person.id === Number(getValues("responsible_executor"))
		);
		setManagerExecutors([
			...managerExecutors,
			{
				id: selectedManager?.id,
				title: selectedManager?.title,
			},
		]);
	}, [everyoneExceptEmployees]);

	return (
		<div className="special-menu__body">
			<h2>Допуск/согласование</h2>
			<div className="sNewPermit__agree">
				<div className="form-wrap">
					<div className="row">
						<div className="col-xl-4 col-lg-6">
							<CustomSelect
								title={"Ответственный руководитель (исполнитель) работ"}
								control={control}
								regName={"manager_executor"}
								options={managerExecutors}
							/>
							<CustomSelect
								title={"Допускающий к работе"}
								control={control}
								regName={"admitting_person"}
								options={everyoneExceptEmployees}
							/>
							<CustomSelect
								title={"Специалист службы производственной безопасности"}
								control={control}
								regName={"industry_safety_officer"}
								options={everyoneExceptEmployees}
							/>
							<CustomSelect
								title={"Специалист по охране труда"}
								control={control}
								regName={"work_safety_officer"}
								options={everyoneExceptEmployees}
							/>
							<CustomSelect
								title={"Лицо, утвердившее наряд-допуск"}
								control={control}
								regName={"permit_approver"}
								options={everyoneExceptEmployees}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default memo(ApprovalsTab);
