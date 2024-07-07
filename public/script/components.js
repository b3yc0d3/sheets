import { h, text } from "./superfine.js";

const Window = () => h("div", { class: "window" }, [
	Header("header", [
		Button({ size: "large", props: { id: "btn-sidebar", class: "object-hidden" } }, [
			Icon({ icon: "menu" })
		]),
		Image({ src: "assets/img/avatar.webp", shape: "circle", props: { class: "pull-right" } })
	]),
	h("div", { class: "window-content" }, [
		PaneGroup({}, [
			Pane({ size: "one-fifth" }, [
				List([
					ListHeader({}, [
						h("input", { class: "form-control", id: "search-cw", type: "text", placeholder: "Kalenderwochen durchsuchen..." })
					]),
					ReportBookletItem(25, "17.06.204", "23.06.2024", "warning"),
					ReportBookletItem(26, "24.06.204", "30.06.2024", "ok"),
					ReportBookletItem(27, "01.07.204", "07.07.2024", "ok"),
					ReportBookletItem(28, "08.07.204", "14.07.2024", "unknown"),
					ReportBookletItem(29, "15.07.204", "21.07.2024", "unknown"),
				])
			]),
			Pane({ size: "normal", props: { class: "pane-no-scroll" } }, [
				ReportBooklet({}, [
					ReportBookletRow({ enabled: true, week_day: "monday" }),
					ReportBookletRow({ enabled: false, week_day: "tuesday" }),
					ReportBookletRow({ enabled: false, week_day: "wednesday" }),
					ReportBookletRow({ enabled: false, week_day: "thursday" }),
					ReportBookletRow({ enabled: false, week_day: "friday" }),
					ReportBookletRow({ enabled: false, week_day: "saturday" }),
					ReportBookletRow({ enabled: false, week_day: "sunday" }),
				]),
				Header("footer", [
					Button({ size: "normal", type: "primary", props: { class: "pull-right", onclick: () => {alert("DONE")} } }, [
						text("Fertig")
					])
				])
			])
		])
	])
]);

const StatusColor = Object.freeze({
	"warning": "#fc605b",
	"unknown": "rgba(115, 116, 117, .5)",
	"ok": "#34c84a",
})
/**
 * 
 * @param {("warning" | "unknown" | "ok")} status 
 * @returns 
 */
const ReportBookletItem = (cal_week, date_start, date_end, status = "unknown") => ListItem(
	{ props: { class: [...(status === "warning" ? ["warning"] : [])].join(" ") } },
	[
		h("div", { class: "media-body" }, [
			h("strong", {}, [
				text(`Bericht KW `),
				h("u", {}, [text(cal_week)]),
				Icon({ icon: "record", padding: "left", props: { style: `color: ${StatusColor[status]}` } }),
			]),
			h("p", {}, [text(`${date_start} - ${date_end}`)])
		])
	])

const ReportBooklet = ({ disabled = false }, days = []) => h("div",
	{ class: ["rep-booklet", ...(disabled ? ["disabled"] : [])].join(" ") },
	[
		h("table", {}, [
			h("thead", {}, [
				h("tr", {}, [
					h("th", {}, []),
					h("th", {}, [text("Ausgeführte Arbeiten, Unterricht, Unterweisungen, uw.")]),
					h("th", {}, [text("Einzel Stunden")]),
					h("th", {}, [text("Gesamt Stunden")]),
				])
			]),
			h("tbody", {}, days)
		])
	]);

/**
 * 
 * @param {Object} options
 * @param {boolean} options.enabled
 * @param {("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday") options.week_day}
 * @returns 
 */
const ReportBookletRow = ({ enabled = false, week_day = "monday" }, lines = ["", "", "", "", "", ""], individual_hours = ["", "", "", "", "", ""], total_hours = "") => h("tr",
	{ id: week_day, class: [...(enabled ? [] : ["disabled"])].join(" ") },
	[
		h("td", {}, [text(week_day)]),
		h("td", {}, [ // Stuff the person did that day
			ReportBookletLines({ editable: enabled }, lines)
		]),
		h("td", {}, [ // Individual hours
			ReportBookletLines({ editable: enabled }, individual_hours)
		]),
		h("td", {}, [ // Total hours
			h("div", { contentEditable: enabled, class: "rep-booklet-total-hours" }, [
				text(total_hours)
			])
		]),
	]);

/**
 * 
 * @param {Object} options
 * @param {boolean} options.editable
 * @param {Array.<string>} lines 
 * @returns 
 */
const ReportBookletLines = ({ editable = false }, lines = ["", "", "", "", "", ""]) => h("div", { class: "rep-booklet-lines" },
	[
		...lines.map((line) => h("div", { contentEditable: editable }, [text(line)]))
	]);

/**
 * PhotonKit specific Elements
 */

/**
 * 
 * @param {("header"|"footer")} position 
 * @param {Array} actions
 * @param {String} title
 */
const Header = (position, actions = null, title = null) => h("header",
	{ class: ["toolbar", `toolbar-${position}`].join(" ") },
	[
		...(title ? [h("h1", { class: "title" }, [text(title)])] : []),
		...(actions ? [h("div", { class: "toolbar-actions" }, [...actions])] : [])
	]);

/**
 * 
 * @param {Object} options
 * @param {("normal" | "large" | "mini")} options.size 
 * @param {("default" | "primary" | "positive" | "negative" | "warning")} options.type
 * @param {Object.<String, any>} options.props
 * @returns 
 */
const Button = ({ size = "normal", type = "default", props = {} }, children = []) => h("button",
	mergeObjects(props, {
		class: ["btn", size !== "normal" ? `btn-${size}` : "", `btn-${type}`].join(" ")
	}),
	[
		...children
	]);

/**
 * @param {Object} options
 * @param {String} options.icon
 * @param {("left" | "right")} options.padding
 * @param {Object.<String, any>} options.props
 */
const Icon = ({ icon, padding = null, props = [] }, children = []) => h("span",
	mergeObjects(props, {
		class: ["icon", `icon-${icon}`, ...(padding ? [`icon-pad-${padding}`] : [])].join(" ")
	}),
	[
		...children
	]);

/**
 * 
 * @param {Object} options
 * @param {String} options.src
 * @param {("rounded" | "circle")} options.shape
 * @param {Object.<String, any>} options.props
 * @param {("fill" | "cover" | "contain" | "scale-down")} options.fit
 * @param {Array.<number, number>} options.size
 * @returns 
 */
const Image = ({ src = "#", shape = "rounded", fit = "cover", props = [], size = [32, 32] }) => h("img",
	mergeObjects({
		src: src,
		class: ["media-object", `img-${shape}`, `object-fit-${fit}`].join(" "),
		width: size[0],
		height: size[1]
	}, props),
	[]);

/**
 * 
 * @param {Object} options
 * @param {Object.<String, any>} options.props
 * @param {Array} panes
 * @returns 
 */
const PaneGroup = ({ props = {} }, panes = []) => h("div",
	mergeObjects({ class: ["pane-group"].join(" ") }, props), panes);

/**
 * 
 * @param {Object} options
 * @param {("normal" | "sm" | "mini" | "one-fourth" | "one-fifth" | "one-third")} options.size
 * @param {Object.<String, any>} options.props
 * @returns 
 */
const Pane = ({ size = "normal", props = {} }, children = []) => h("div",
	mergeObjects({ class: [...(size !== "normal" ? [`pane-${size}`] : ["pane"])].join(" ") }, props), children);

/**
 * 
 * @param {Array} items 
 * @param {Object.<String, any>} props 
 * @returns 
 */
const List = (items = [], props = {}) => h("ul",
	mergeObjects({ class: "list-group" }, props), items);


const ListItem = ({ props = {} }, children = []) => h("li",
	mergeObjects({ class: ["list-group-item"].join(" ") }, props),
	children);

const ListHeader = ({ props = {} }, children = []) => h("li",
	mergeObjects({ class: ["list-group-header"].join(" ") }, props),
	children);

export { Window, Header };

function mergeObjects(obj1, obj2) {
	const result = { ...obj2 }; // Start with obj2 as the base

	for (const key in obj1) {
		if (obj1.hasOwnProperty(key)) {
			if (obj2.hasOwnProperty(key)) {
				// If both objects have the same key and the values are strings, concatenate them
				if (typeof obj1[key] === 'string' && typeof obj2[key] === 'string') {
					result[key] = `${obj1[key]} ${obj2[key]}`;
				}
				// If obj1 has a string and obj2 has an array, convert obj1's string to array and concatenate
				else if (typeof obj1[key] === 'string' && Array.isArray(obj2[key])) {
					result[key] = [obj1[key], ...obj2[key]];
				}
				// If obj2 has a string and obj1 has an array, convert obj2's string to array and concatenate
				else if (Array.isArray(obj1[key]) && typeof obj2[key] === 'string') {
					result[key] = [...obj1[key], obj2[key]];
				}
				// If both are arrays, concatenate the arrays
				else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
					result[key] = [...obj1[key], ...obj2[key]];
				}
			} else {
				// If only obj1 has the key, add it to the result
				result[key] = obj1[key];
			}
		}
	}

	return result;
}