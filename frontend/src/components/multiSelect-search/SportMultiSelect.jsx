import Select from "react-select";
import makeAnimated from "react-select/animated";

const SportsMultiSelect = ({
  sportsArray,
  selectedSports,
  setSelectedSports,
  filter,
}) => {
  // Ensure filter is a string
  const filterString = typeof filter === "string" ? filter.toLowerCase() : "";

  // Filter sports based on the input filter
  const filteredSports = sportsArray?.filter((sport) =>
    sport.name.toLowerCase().includes(filterString)
  );

  // Map filtered sports to the format required by react-select
  const sportOptions = filteredSports?.map((sport) => ({
    value: sport.id,
    label: sport.name,
  }));

  // Handle change in selected sports
  const handleSelectChange = (selectedOptions) => {
    setSelectedSports(selectedOptions);
  };

  return (
    <Select
      isMulti
      components={makeAnimated()}
      value={selectedSports}
      openMenuOnFocus={false}
      openMenuOnClick={false}
      styles={{
        // Styles for the select component
        control: (provided) => ({
          ...provided,
          border: "1px solid rgb(var(--color-border-primary))",
          color: "rgb(var(--color-text-primary))",
          borderRadius: "0.375rem",
          minWidth: "15rem",
          minHeight: "2.5rem",
          backgroundColor: "rgb(var(--color-bg-secondary))",
        }),

        // Styles for the input field text color
        input: (provided) => ({
          ...provided,
          color: "rgb(var(--color-text-primary))",
        }),

        // Styles of the whole component of sport when multiple values are selected
        multiValue: (provided) => ({
          ...provided,
          borderRight: "1px solid rgb(var(--color-border-primary))",
          borderRadius: "0.375rem",
          backgroundColor: "rgb(var(--color-bg-gray))",
        }),
        // label of the selected component
        multiValueLabel: (provided) => ({
          ...provided,
          borderRadius: "0.375rem 0 0 0.375rem",
          color: "rgb(var(--color-text-primary))",
        }),

        // x button to remove a selected value
        multiValueRemove: (provided) => ({
          ...provided,
          color: "rgb(var(--color-text-primary))",
          ":hover": {
            backgroundColor: "rgb(var(--color-bg-primary))",
            color: "rgb(var(--color-text-primary))",
          },
        }),

        // styles for the dropdown options
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected
            ? "rgb(var(--color-primary))"
            : state.isFocused
              ? "rgb(var(--color-primary))"
              : "rgb(var(--color-bg-secondary))",
          color: "rgb(var(--color-text-primary))",
          ":active": {
            backgroundColor: "rgb(var(--color-bg-primary))",
            color: "rgb(var(--color-text-primary))",
          },
        }),

        // Styles for the dropdown menu when opened
        menu: (provided) => ({
          ...provided,
          backgroundColor: "rgb(var(--color-bg-secondary))",
          color: "rgb(var(--color-text-primary))",
        }),
      }}
      onChange={handleSelectChange}
      options={sportOptions}
      closeMenuOnSelect={false}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Valitse urheilulajit"
    />
  );
};

export default SportsMultiSelect;
