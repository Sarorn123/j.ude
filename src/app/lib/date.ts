import moment from "moment"

export function formatDate(date: Date | string, format: string = "DD-MM-yyyy") {
    return moment(date).format(format);
}