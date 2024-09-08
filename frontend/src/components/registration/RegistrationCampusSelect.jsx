import React from "react";
import Select from "react-select";

const CampusSelect = ({
  inputClass,
  errorClass,
  errors,
  registrationData,
  options,
  handleDropdownChange,
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgb(var(--color-bg-secondary))",
      color: "rgb(var(--color-text-primary))",
      borderColor:
        errors.campusId && errors.campusId.value === "error"
          ? "red"
          : errors.campusId && errors.campusId.value === "success"
            ? "green"
            : provided.borderColor,
    }),
    input: (provided) => ({
      ...provided,
      color: "rgb(var(--color-text-primary))",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "rgb(var(--color-primary))"
        : state.isFocused
          ? "rgb(var(--color-hover-select))"
          : "rgb(var(--color-bg-secondary))",
      color: state.isDisabled
        ? "rgb(var(--color-text-secondary))"
        : "rgb(var(--color-text-primary))",
      ":active": {
        backgroundColor: "rgb(var(--color-bg-primary))",
        color: "rgb(var(--color-text-primary))",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgb(var(--color-bg-secondary))",
      color: "rgb(var(--color-text-primary))",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "rgb(var(--color-text-primary))", // Ensure the displayed value text color is color-text-primary
    }),
  };

  const campusOptions = options.campuses.map((campus) => ({
    value: campus.id,
    label: campus.name,
  }));

  return (
    <Select
      styles={customStyles}
      className={inputClass}
      value={
        registrationData.campusId
          ? campusOptions.find(
              (option) => option.value === registrationData.campusId
            )
          : null
      }
      onChange={(selectedOption) =>
        handleDropdownChange({
          target: {
            name: "campusId",
            value: selectedOption ? selectedOption.value : "",
          },
        })
      }
      options={campusOptions}
      placeholder="Valitse kampus"
      isClearable
      noOptionsMessage={() => "Ei tuloksia"}
      menuShouldScrollIntoView={true}
      menuPortalTarget={document.body}
      menuPlacement="auto"
    />
  );
};

export default CampusSelect;
