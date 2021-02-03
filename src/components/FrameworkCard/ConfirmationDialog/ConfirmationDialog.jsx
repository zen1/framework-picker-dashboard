import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Layer,
	Box,
	Heading,
	Button,
	TextInput,
	Form,
	FormField,
} from "grommet";

// Queries
import { useCastVote } from "../../../api/queries";

const ConfirmationDialog = ({ onClose, displayName, choice }) => {
	const [formValue, setFormValue] = useState({ email: "" });
	const [formError, setFormError] = useState({
		email: "",
	});
	const { mutate: castVote } = useCastVote({
		overrides: {
			onSuccess: () => {
				onClose();
			},
			onError: err => {
				console.log("ERROR: ", err.message);
			},
		},
	});

	const displayText = displayName
		? `Are you sure you want to vote for ${displayName}?`
		: "Are you sure?";

	return (
		<Layer onEsc={onClose}>
			<Box margin="medium">
				<Heading level="4">{displayText}</Heading>
				<Form
					value={formValue}
					errors={formError}
					onChange={nextValue => setFormValue(nextValue)}
					onReset={() => setFormValue({ email: "" })}
					onSubmit={({ value }) => {
						value["choice"] = choice;
						castVote(value);
					}}
				>
					<FormField name="email" htmlFor="email" label="Email Address">
						<TextInput
							id="email"
							type="email"
							placeholder="Enter email..."
							name="email"
						/>
					</FormField>
					<Box
						direction="row"
						pad="small"
						justify="end"
						align="center"
						gap="small"
					>
						<Button
							type="reset"
							primary
							color="status-error"
							label="No"
							onClick={onClose}
						/>
						<Button
							type="submit"
							disabled={formValue.email.trim() === ""}
							primary
							color="status-ok"
							label="Yes"
						/>
					</Box>
				</Form>
			</Box>
		</Layer>
	);
};

ConfirmationDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	displayName: PropTypes.string,
	choice: PropTypes.string.isRequired,
};

export default ConfirmationDialog;