/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright 2014 Oracle and/or its affiliates. All rights reserved.
 *
 * Oracle and Java are registered trademarks of Oracle and/or its affiliates.
 * Other names may be trademarks of their respective owners.
 *
 * The contents of this file are subject to the terms of either the GNU
 * General Public License Version 2 only ("GPL") or the Common
 * Development and Distribution License("CDDL") (collectively, the
 * "License"). You may not use this file except in compliance with the
 * License. You can obtain a copy of the License at
 * http://www.netbeans.org/cddl-gplv2.html
 * or nbbuild/licenses/CDDL-GPL-2-CP. See the License for the
 * specific language governing permissions and limitations under the
 * License.  When distributing the software, include this License Header
 * Notice in each file and include the License file at
 * nbbuild/licenses/CDDL-GPL-2-CP.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the GPL Version 2 section of the License file that
 * accompanied this code. If applicable, add the following below the
 * License Header, with the fields enclosed by brackets [] replaced by
 * your own identifying information:
 * "Portions Copyrighted [year] [name of copyright owner]"
 *
 * If you wish your version of this file to be governed by only the CDDL
 * or only the GPL Version 2, indicate your decision by adding
 * "[Contributor] elects to include this software in this distribution
 * under the [CDDL or GPL Version 2] license." If you do not indicate a
 * single choice of license, a recipient has the option to distribute
 * your version of this file under either the CDDL, the GPL Version 2 or
 * to extend the choice of license to its licensees as provided above.
 * However, if you add GPL Version 2 code and therefore, elected the GPL
 * Version 2 license, then the option applies only if the new code is
 * made subject to such option by the copyright holder.
 *
 * Contributor(s):
 *
 * Portions Copyrighted 2014 Sun Microsystems, Inc.
 */

"use strict";

angular.module("App", ['highcharts-ng']).controller("highchartCtrl", ["$scope","$interval", "$http", function HomeCtrl($scope,$interval, $http) {
    $scope.messages = [];
    $scope.currentMessage = "";
 $scope.chartConfig = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Hello'
      }
    }
    $scope.chartSpeed = {
      mdtitle: 'Speed zones',
      visibleSeries: true,
      options: {
        chart: {
          type: 'line',
          marginTop: 30,
          marginLeft: 40,
          plotBackgroundColor: 'rgba(40, 41, 51, 0.3)',
        },
        credits: {
          enabled: false
        },
        tooltip: {
          style: {
            padding: 10,
            fontWeight: 'bold'
          },
          valueSuffix: '',
          formatter: function () {
            var date = $filter('date')(this.point.x, 'MMM d');
            if ($scope.chartCorrectMultiYear) {
              date = $filter('date')(this.point.x, 'mediumDate');
            }
            return date + " <br>Percent :" + this.point.y;
          }
        },
        legend: {
          enabled: false,
          itemStyle: {
            fontWeight: 'normal'
          },
          itemMarginBottom: 10,
          symbolPadding: 20,
          symbolWidth: 50
        }
      },
      title: {
        text: ''
      },
      loading: false,
      yAxis: {
        title: {
          text: 'Accuracy %',
          align: 'high',
          offset: 0,
          rotation: 0,
          y: -10,
          x: 30
        },
        max: 100,
        min: 0
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {// don't display the dummy year
          day: '%b. %e',
          week: '%b. %e',
          month: '%b'
        },
        labels: {
          formatter: function () {
            if ($scope.chartCorrectMultiYear) {
              return  Highcharts.dateFormat('%b. %e %Y', this.value);
            } else {
              return Highcharts.dateFormat(this.dateTimeLabelFormat, this.value);
            }
          }
        },
        minTickInterval: 24 * 3600 * 1000,
        title: {
          text: 'Date'
        }
      },
      func: function (chart) {
        $timeout(function () {
          chart.reflow();
        }, 200);
      }
    };
   
	
    $interval(function () {
      var ramdom = Math.floor((Math.random() * 6));
      ;
      $http.get("activity-data.json?" + ramdom).then(function (result) {

        var series = [];
        var dataToChart = [];
        for (var i in result.data) {

          var item = result.data[i];
          if (item) {
            var dataDay = item.dataDay;
            var arrayData = [];
            for (var j in item.dataDay) {
              arrayData.push({
                x: dataDay[j].time,
                y: dataDay[j].speed
              });
            }
            series.push({

              name: item.zoneId,
              data: arrayData

            });
            dataToChart.push(
                [
                  item.zoneId,
                  item.data.count
                ]

                );
          }
        }
        var test = [[Date.UTC(1970, 9, 21), 0],
          [Date.UTC(1970, 10, 4), 0.28],
          [Date.UTC(1970, 10, 9), 0.25],
          [Date.UTC(1970, 10, 27), 0.2],
          [Date.UTC(1970, 11, 2), 0.28],
          [Date.UTC(1970, 11, 26), 0.28],
          [Date.UTC(1970, 11, 29), 0.47],
          [Date.UTC(1971, 0, 11), 0.79],
          [Date.UTC(1971, 0, 26), 0.72],
          [Date.UTC(1971, 1, 3), 1.02],
          [Date.UTC(1971, 1, 11), 1.12],
          [Date.UTC(1971, 1, 25), 1.2],
          [Date.UTC(1971, 2, 11), 1.18],
          [Date.UTC(1971, 3, 11), 1.19],
          [Date.UTC(1971, 4, 1), 1.85],
          [Date.UTC(1971, 4, 5), 2.22],
          [Date.UTC(1971, 4, 19), 1.15],
          [Date.UTC(1971, 5, 3), 0]];
        console.log(test);
        console.log('Date.UTC(1970, 10, 4)', Date.UTC(1970, 10, 4));
        console.log('dataToChart', dataToChart);
        $scope.chartSpeed.series = series;
        $scope.chartConfig.series = [{
            name: 'Number country',
            data: dataToChart
          }];
      }, function (e) {
        window.console.error(e);
      });
    }, 5000)

  }]);