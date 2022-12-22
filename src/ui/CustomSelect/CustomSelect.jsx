import { memo, useMemo } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import ErrorWrapper from "../ErrorWrapper/ErrorWrapper";
import {
	DropdownIndicator,
	selectStyles,
} from "../SelectTemplate/SelectTemplate";

const CustomSelect = ({
	title,
	control,
	regName,
	options,
	errors,
	disabled,
}) => {
	const memoNewOptions = useMemo(
		() =>
			options.map(({ title, id }) => ({
				label: title,
				value: id,
			})),
		[options]
	);

	return (
		<div className="form-wrap__input-wrap">
			<div className="form-wrap__input-title">{title}</div>
			<Controller
				control={control}
				name={regName}
				render={({ field: { onChange, value, ref } }) => (
					<Select
						inputRef={ref}
						components={{ DropdownIndicator }}
						noOptionsMessage={() => "Нет совпадений"}
						styles={selectStyles}
						placeholder="Выберите"
						menuPlacement="auto"
						value={memoNewOptions.find(({ value: val }) => val === value) || ""}
						onChange={(val) => onChange(val.value)}
						options={memoNewOptions}
						isSearchable
						isDisabled={disabled}
					/>
				)}
			/>
			<ErrorWrapper errors={errors} />
		</div>
	);
};

export default memo(CustomSelect);
