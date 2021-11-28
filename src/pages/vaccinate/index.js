/**
 * 疫苗JS入口
 */
 import "bootstrap";
 import "bootstrap/dist/css/bootstrap.css";
 import "./index.css";
 
 import { select } from "d3-selection";
 
 select("body").append("h1").text("Hello wolrd!").attr('class','hello-world');