/**
 * 数据表格JS入口
 */
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { createTable } from "../../components/table";
import { select } from "d3-selection";
import "./index.css";

createTable(select("#table"));
