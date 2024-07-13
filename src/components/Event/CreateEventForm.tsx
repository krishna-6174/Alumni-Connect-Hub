import React, { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
// import { useNavigate } from "react-router";
import Button from "../../elements/Button";
import InputField from "../../elements/InputField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Label from "../../elements/Label";
import ImageUploader from "../../components/ImageUploader";
import TextArea from "../../elements/TextArea";
import Loader from "../Loader";
import { getBaseUrl } from "../../hooks/baseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { LOCAL_STORAGE_KEYS } from "../../constants/Global";
import { getFromStorage } from "../../utils/token";

interface FormData {
    title: string;
    event_date: string;
    start_time: string;
    location: string;
    description: string;
    image: File | null;
}

const schema = yup.object().shape({
    title: yup.string().required("Event Title is required"), 
    event_date: yup.string().required("Event Date is required"), 
    start_time: yup.string().required("Event Start Time is required"), 
    location: yup.string().required("Location is required"),
    description: yup.string().required("Event Details are required"), 
    // Consider adding validation for the image field if necessary
});

type FieldKeys =
    | "title"
    | "event_date"
    | "start_time"
    | "location"
    | "description"
    | "image";

const CreateEventForm: FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [reqImage, setReqImage] = useState<null | File>(null);

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            title: "",
            event_date: "",
            start_time: "",
            location: "",
            description: "",
            image: null,
        },
    });

    const token = getFromStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

    const onSubmit: SubmitHandler<FormData> = async (payload: FormData) => {
        payload.image = reqImage;
        setIsLoading(true);
        try {
            const url = getBaseUrl() + "/event/create";
            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Submit Successful", response);
            reset();
            toast.success("Event create successful!", {
                autoClose: 1500,
            });
        } catch (error) {
            const errorMessage =
                typeof error?.response?.data === "string"
                    ? error.response.data
                    : "An unexpected error occurred. Please try again.";
            toast.error(errorMessage, {
                autoClose: 3000,
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="w-[821px] h-[900px] bg-white">
            {/* headline */}
            <div className="mt-16 flex flex-col justify-center items-center">
                <h2 className="text-2xl text-black font-semibold">
                    Create an Event
                </h2>
            </div>

            {/* Signup Form */}
            <div className="flex flex-col justify-center items-center mt-6">
                <form
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {[
                        {
                            name: "EventTitle",
                            key: "title",
                            placeholder: "Event Title",
                            type: "text",
                        },
                        {
                            name: "EventDate",
                            key: "event_date",
                            placeholder: "Event Date",
                            type: "date",
                        },
                        {
                            name: "EventStartTime",
                            key: "start_time",
                            placeholder: "Event Start Time",
                            type: "time",
                        },
                        {
                            name: "Location",
                            key: "location",
                            placeholder: "Location",
                            type: "text",
                        },
                    ].map((field) => (
                        <div key={field.key}>
                            <Label
                                labelText={field.placeholder}
                                htmlFor={field.key}
                                customClass="text-md"
                            />
                            <Controller
                                name={field.key as FieldKeys}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <InputField
                                        type={field.type}
                                        id={field.key}
                                        name={field.name}
                                        value={value as string}
                                        onChange={onChange}
                                        placeholder={field.placeholder}
                                        customInputClass="w-100 border-zinc-300 bg-white flex-shrink-0 rounded-lg placeholder:text-sm placeholder:text-zinc-600 placeholder:font-normal"
                                    />
                                )}
                            />
                            {errors[field.key] && (
                                <p className="text-red-500 text-sm">
                                    {errors[field.key]?.message}
                                </p>
                            )}
                        </div>
                    ))}

                    {[
                        {
                            name: "EventDetails",
                            key: "description",
                            placeholder: "Event Details",
                            type: "text",
                        },
                    ].map((field) => (
                        <div key={field.key}>
                            <Label
                                labelText={field.placeholder}
                                htmlFor={field.key}
                                customClass="text-md"
                            />
                            <Controller
                                name={field.key as FieldKeys}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextArea
                                        type={field.type}
                                        customInputClass="w-100 border-zinc-300 bg-white flex-shrink-0 rounded-lg placeholder:text-sm placeholder:text-zinc-600 placeholder:font-normal"
                                        value={value as string}
                                        onChange={onChange}
                                        id={field.key}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        height="auto"
                                    />
                                )}
                            />
                            {errors[field.key] && (
                                <p className="text-red-500 text-sm">
                                    {errors[field.key]?.message}
                                </p>
                            )}
                        </div>
                    ))}
                    <Label
                        labelText="Upload Event Photo"
                        customClass="text-md"
                    />
                    {/* Event Photo upload field  */}
                    <ImageUploader
                        onUpload={(file) => {
                            setReqImage(file.image);
                        }}
                        name="image"
                    />

                    {/* Submit Button */}

                    <Button
                        buttonType="submit"
                        customClass="flex justify-center item-center !bg-primary !text-black w-100 font-semibold text-sm"
                        disabled={isLoading}
                    >
                        <div className="flex items-center justify-center relative min-w-48 min-h-12">
                            {isLoading ? (
                                <Loader mode="container" />
                            ) : (
                                "Create Event"
                            )}
                        </div>
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateEventForm;
