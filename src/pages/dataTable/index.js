/**
 * 数据表格JS入口
 */
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { createTableLine } from "../../components/table-line";
import { select } from "d3-selection";
import "./index.css";

createTableLine(select("#table-line"));
