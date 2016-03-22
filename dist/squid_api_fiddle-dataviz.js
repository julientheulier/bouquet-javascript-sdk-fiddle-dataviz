this["squid_api"] = this["squid_api"] || {};
this["squid_api"]["template"] = this["squid_api"]["template"] || {};

this["squid_api"]["template"]["squid_api_dataviz_creator"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                    <div class=\"col-md-8\">\n                        <label class=\"guide\">";
  if (helper = helpers.headerText) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.headerText); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    </div>\n                ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                                <option value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                            ";
  return buffer;
  }

  buffer += "<div class=\"squid-api-dataviz-creator bothVisible\">\n    <div class=\"row\">\n        <div class=\"col-md-6 editor-container\">\n            <div class=\"col-md-12\">\n                ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.headerText), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                <div class=\"col-md-4\">\n                    <div id=\"squid-api-dataviz-template-selector\">\n                        <select class=\"form-control\" id=\"template-selector\">\n                            <option selected=selected value=\"none-selected\">Choose Template</option>\n                            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.templates), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                        </select>\n                    </div>\n                </div>\n            </div>\n            <div class=\"col-md-12\" id=\"squid-api-dataviz-creator-editor\">\n\n            </div>\n            <div class=\"configuration bothVisible\">\n                <div class=\"col-md-8 save-wrapper pull-left\">\n                    <div class=\"col-md-7\">\n                        <button class=\"btn btn-default save\">3. Publish your Bookmark</button>\n                    </div>\n                    <div class=\"col-md-5\">\n                        <input class=\"form-control viz-name\" placeholder=\"Name\"/>\n                    </div>\n                </div>\n                <div class=\"col-md-4\">\n                    <div class=\"apply-wrapper\">\n                        <button class=\"btn btn-default pull-right apply\"><i class=\"fa fa-arrow-circle-right\"></i> Apply</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <button class=\"btn btn-default pull-right form-control editor-toggle\">Hide Editor</button>\n        <div class=\"col-md-6 preview-container\">\n            <div class=\"col-md-12\" id=\"squid-api-dataviz-creator-preview\"></div>\n        </div>\n    </div>\n</div>";
  return buffer;
  });
(function (root, factory) {
    root.squid_api.view.DataVizCreator = factory(root.Backbone, root.squid_api, squid_api.template.squid_api_dataviz_creator);

}(this, function (Backbone, squid_api, template) {

    var View = Backbone.View.extend({
        template: null,
        model: null,
        bookmarks: null,
        onEditorToggleChange: null,
        dataVizEl : "squid-api-dataviz-creator-preview",
        headerText: null,

        initialize: function(options) {
            this.config = squid_api.model.config;
            this.status = squid_api.model.status;
            if (options.template) {
                this.template = options.template;
            } else {
                this.template = template;
            }
            if (options.bookmarks) {
                this.bookmarks = options.bookmarks;
            } else {
                this.bookmarks = new squid_api.view.BookmarkCollectionManagementWidget({

                });
            }

            this.defaultVisulisation = this.barChartViz;

            if (options.onEditorToggleChange) {
                this.onEditorToggleChange = options.onEditorToggleChange;
            }
            if (options.headerText) {
                this.headerText = options.headerText;
            }
            if (options.model) {
                this.model = options.model;
            } else {
                console.warn("no analysis model passed to the widget");
            }

            this.listenTo(this.config,"change:bookmark", this.widgetToggle);
            this.listenTo(this.config,"change:dataviz", this.renderCreator);
            this.listenTo(this.model,"change:results", this.renderPreview);

            this.renderBase();
        },

        events: {
            'click .apply': function(event) {
                this.renderPreview();
            },
            'click .editor-toggle': function(event) {
                // store editor / preview div's
                var editor = this.$el.find(".editor-container #squid-api-dataviz-creator-editor");
                var datavizCreator = this.$el.find(".squid-api-dataviz-creator");
                var configuration = this.$el.find(".squid-api-dataviz-creator .editor-container .configuration");
                var applyBtn = this.$el.find(".editor-container .apply");
                var preview = this.$el.find(".preview-container");
                var button = $(event.currentTarget);
                var buttonText;
                var hidden = false;

                // manipulate divs
                if (! editor.hasClass("hidden")) {
                    hidden = true;
                    editor.addClass("hidden");
                    datavizCreator.removeClass("bothVisible");
                    configuration.removeClass("bothVisible");
                    applyBtn.addClass("hidden");
                    this.$el.find("#squid-api-dataviz-template-selector").addClass("hidden");

                    // expand preview to 100%
                    preview.removeClass("col-md-6");
                    preview.addClass("col-md-12");

                    buttonText = "Show Editor";
                } else {
                    editor.removeClass("hidden");
                    applyBtn.removeClass("hidden");
                    configuration.addClass("bothVisible");
                    datavizCreator.addClass("bothVisible");
                    this.$el.find("#squid-api-dataviz-template-selector").removeClass("hidden");

                    // revert to 50/50
                    preview.removeClass("col-md-12");
                    preview.addClass("col-md-6");

                    buttonText = "Hide Editor";
                }

                if (this.onEditorToggleChange) {
                    this.onEditorToggleChange.call(this, hidden);
                }

                // update button text
                button.text(buttonText);

                // trigger an apply
                this.renderPreview();
            },
            'click .save': function(event) {
                this.saveViz(event);
            },
            'change #template-selector': function(event) {
                var val = $(event.currentTarget).val();
                // update the editor value
                if (this[val]) {
                    var entire = this[val].toString();
                    var body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
                    this.editor.getSession().setValue(body);
                    this.renderPreview();
                }
            }
        },

        widgetToggle: function() {
            var bookmark = this.config.get("bookmark");
            if (bookmark) {
                this.$el.find(".overlay").remove();
            } else {
                this.$el.find(".squid-api-dataviz-creator").append("<div class='overlay'></div>'");
            }

            // reset selector
            this.$el.find("#template-selector").val("none-selected");
        },

        afterSave: function() {

        },

        saveViz: function(e) {
            var me = this;

            var bookmarkCollection = this.bookmarks;
            var bookmark = this.config.get("bookmark");

            var editorBody = this.editor.getSession().getValue();
            var vizName = this.$el.find(".viz-name").val();

            if (vizName.length !== 0 && bookmark) {
                if (bookmarkCollection) {
                    var bookmarkModel = bookmarkCollection.collection.where({oid : bookmark})[0];
                    var bookmarkModelConfig = $.extend(true, {}, bookmarkModel.get("config"));
                    var bookmarkName = bookmarkModel.get("name") + "_" + vizName;

                    // disable button
                    $(e.currentTarget).attr("disabled", true);

                    //overwrite config
                    bookmarkModelConfig = this.config.toJSON();

                    // store bookmark
                    var arr = [{id : vizName, body: editorBody}];
                    bookmarkModelConfig.dataviz = arr;

                    if (bookmarkModel.get("config").dataviz) {
                        // dataviz exists
                        if (_.where(bookmarkModel.get("config").dataviz, {id : vizName}).length > 0) {
                            // overwrite existing dataviz
                            bookmarkModel.save({"config" : bookmarkModelConfig}, {success: function(m) {
                                me.status.set("message", vizName + " has been updated within bookmark '" + m.get("name") + "'");
                                // enable button
                                $(e.currentTarget).attr("disabled", false);
                            }});
                        } else {
                            this.createNewBookmark(e, bookmarkName, bookmarkModelConfig);
                        }
                    } else {
                        this.createNewBookmark(e, bookmarkName, bookmarkModelConfig);
                    }

                    // set config
                    this.config.set("dataviz", arr);
                }
            } else {
                this.status.set("message", "please specify a name for your visulisation");
            }
        },

        createNewBookmark: function(e, bookmarkName, bookmarkModelConfig) {
            var me = this;

            // create a new bookmark with the new dataviz inside
            var newBookmarkModel = new squid_api.model.BookmarkModel();
            newBookmarkModel.set({
                "id" : {
                    projectId: this.config.get("project")
                },
                "name" : bookmarkName,
                "config" : bookmarkModelConfig
            });
            newBookmarkModel.save({"config" : bookmarkModelConfig}, {success: function(m) {
                me.bookmarks.collection.add(m);
                // set new bookmark as current one
                squid_api.setBookmarkId(m.get("oid"));

                me.status.set("message", bookmarkName + " has been saved as a new bookmark");
                // enable button
                $(e.currentTarget).attr("disabled", false);
            }});
        },

        editorContents: function(dataviz) {
            var entire = this.defaultVisulisation.toString();
            var body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
            if (dataviz) {
                body = dataviz;
            }
            return body;
        },

        renderBase: function() {
            var data = {
                    "templates" : [ {
                        id : "barChartViz",
                        name : "Bar Chart"
                    }, {
                        id : "tableViz",
                        name : "Table"
                    }, {
                        id : "pieChartViz",
                        name : "Pie Chart"
                    }, {
                        id : "jsonView",
                        name : "JSON View"
                    } ],
                    "headerText" : this.headerText
            };
            
            this.$el.html(this.template(data));
            this.renderCreator();
        },

        renderPreview: function() {
            var body = this.editor.getSession().getValue();

            // empty existing dataviz
            $("#" + this.dataVizEl).empty();

            /*jslint evil: true */
            if (this.model.get("results")) {
                new Function('analysis', 'el', body)(this.model, this.dataVizEl);
            }
        },

        renderCreator: function() {
            // set up editor
            this.editor = ace.edit("squid-api-dataviz-creator-editor");
            var body = null;
            this.editor.getSession().setMode("ace/mode/javascript");
            if (this.config.get("dataviz")) {
                body = this.config.get("dataviz")[0].body;
            }
            this.editor.getSession().setValue(this.editorContents(body));

            return this;
        },

        /**
         * pie-chart datatviz sample code.
         * Note : indentation was reduced on purpose
         */
        pieChartViz: function(analysis, el) {
var data = analysis.get("results").rows.slice(0, 5);

var width = d3.select("#" + el).node().getBoundingClientRect().width,
    height = 650,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#FF8802", "#BF7C31", "#A65801", "#FFA541", "#FFBD74"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.v[1];
    });

var svg = d3.select("#" + el).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("y", 550)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

g.append("path")
    .attr("d", arc)
    .style("fill", function(d) {
        return color(d.value);
    });

g.append("text")
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) {
        return d.data.v[0];
    });
        },

        jsonView: function(analysis, el) {
d3.select("#" + el).append('pre').text(JSON.stringify(analysis.toJSON(), null, 4));
        },
        
        /**
         * table datatviz sample code.
         * Note : indentation was reduced on purpose
         */ 
        tableViz: function(analysis, el) {
// cleanup the viewport which DOM id is given by the "el" attribute
d3.select('#'+el).html("");

// specify the rendering div
var container = d3.select('#'+el);

// create table & append table headers
container.append('table')
    .append('thead')
    .append('tr');

// store our created table
var table = container.select('table');

// insert table header data
table.select("thead tr")
    .selectAll("th")
    .data(analysis.get("results").cols)
    .enter()
    .append("th")
    .text(function(d) {
        return d.name;
    });

// insert table body
table.append('tbody');

// insert table body data
table.select("tbody")
    .selectAll("tr")
    .data(analysis.get("results").rows)
    .enter()
    .append("tr").selectAll("td")
    .data(function(d) {
        return d.v;
    })
    .enter()
    .append("td")
    .text(function(d) {
        return d;
    });
        },
        
        /**
         * table datatviz sample code.
         * Note : indentation was reduced on purpose
         */ 
        barChartViz: function(analysis, el) {
// cleanup the viewport which DOM id is given by the "el" attribute
d3.select('#'+el).html("");

// get the data for Bouquet's analysisJob object passed as "analyisis" attribute
var data = analysis.get("results").rows;
// just take the first n rows
data = data.slice(0,20);

// build a simple barchart - using code from https://bl.ocks.org/mbostock/3885304
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = $('#'+el).width() - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.2);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#"+el).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // x axis values are in the first column (0) of the results array
  x.domain(data.map(function(d) { return d.v[0]; }));

  // y axis values are in the second column (1) of the results array
  y.domain([0, d3.max(data, function(d) { return d.v[1]; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Y Axis");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("style", "fill: steelblue;")
      .attr("x", function(d) { return x(d.v[0]); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.v[1]); })
      .attr("height", function(d) { return height - y(d.v[1]); });
        }
    });

    return View;
}));
