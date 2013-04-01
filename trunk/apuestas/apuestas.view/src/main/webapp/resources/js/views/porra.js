var porra = {
	'rowID' : null,
	'formatList' : function() {
		
		$("#lista").jqGrid({
			datatype : 'local',
			data : [],
			colNames : [
					"Id", "Competici&oacute;n", "Fecha L&iacute;mite"
			],
			colModel : [
					{
						name : 'id',
						index : 'id',
						width : 0,
						hidden : true
					}, {
						name : 'competicion',
						index : 'competicion',
						width : 80,
						sorttype : 'string',
						sortable : true,
						align : 'left'
					}, {
						name : 'fechaLimite',
						index : 'fechaLimite',
						width : 40,
						sorttype : 'string',
						sortable : true,
						align : 'right'
					}
			],
			rowNum : 20,
			rowList : [
					10, 20, 30
			],
			pager : '#paginadorLista',
			sortname : 'apellidos',
			sortorder : 'asc',
			viewrecords : true,
			rownumbers : false,
			scroll : false,
			onSelectRow : function(rowid, status) {
				$("#btnEditar").button("enable");
				$("#btnEliminar").button("enable");
				porra.rowID = rowid;
			}
		});
		$(window).bind('resize', function() {
			$('#lista').setGridWidth($('.ui-jqgrid').parent().innerWidth() - 30);
		}).trigger('resize');
		
		/**
		 * *****Configuración de los botones del formulario de porras**********
		 */
		$("#btnAlta").button().click(function() {
			generic.getForm('porra');
		});
		$("#btnEditar").button().click(function() {
			generic.getForm('porra', $('#lista').jqGrid('getRowData', porra.rowID).id);
		});
		$("#btnEditar").button("disable");

		$("#btnEliminar").button().click(function() {
			generic.delete('porra', $('#lista').jqGrid('getRowData', porra.rowID).id, function() {
				generic.getList('porra');
			});
		});
		$("#btnEliminar").button("disable");
	},

	'formatForm' : function() {
		this.rowID = null;
		
		$("#lista").jqGrid({
			datatype : 'local',
			data : [],
			colNames : [
					"Id", "Orden", "Local", "Visitante", "Resultado"
			],
			colModel : [
					{
						name : 'id',
						index : 'id',
						width : 0,
						hidden : true
					}, {
						name : 'ordinal',
						index : 'ordinal',
						width : 30,
						sorttype : 'string',
						sortable : true,
						align : 'left'
					}, {
						name : 'local',
						index : 'local',
						width : 30,
						sorttype : 'string',
						sortable : true,
						align : 'left'
					}, {
						name : 'visitante',
						index : 'visitante',
						width : 30,
						sorttype : 'string',
						sortable : true,
						align : 'left'
					}, {
						name : 'resultado',
						index : 'resultado',
						width : 30,
						sorttype : 'string',
						sortable : true,
						align : 'center'
					}
			],
			rowNum : 20,
			rowList : [
					10, 20, 30
			],
			pager : '#paginadorLista',
			sortname : 'nombre',
			sortorder : 'asc',
			viewrecords : true,
			rownumbers : false,
			scroll : false,
			onSelectRow : function(rowid, status) {
				$("#btnModifyPartido").button("enable");
				$("#btnDeletePartido").button("enable");
				$("#btnAsigResul").button("enable");
				porra.rowID = rowid;
			}
		});
		
		$(window).bind('resize', function() {
			$('#lista').setGridWidth($('.ui-jqgrid').parent().innerWidth() - 30);
		}).trigger('resize');
		
		var datePickerParams = {
				"dateFormat" : 'dd/mm/yy',
				"dayNamesMin" : [
						"D", "L", "M", "X", "J", "V", "S"
				],
				"firstDay" : 1,
				"monthNames" : [
						"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
				],
				"timeFormat": "HH:mm:ss"
			};
			$("#fecha_limite").datetimepicker(datePickerParams);
		
		$("#btnCancel").button().click(function() {
			generic.getList('porra');
		});

		$("#btnSavePorra").button().click(function() {
			porra.getParams();
		});
		
		$("#btnAddPartido").button().click(function(){
			porra.deseleccionarPartido();
			
			$('#ordinal').val("");
			$('#local').val("");
			$('#visitante').val("");
			
			$('#dialog-form-partido').dialog('option', 'title', 'A&ntilde;adir Partido');
			$(".ui-dialog-buttonpane button:contains('Modificar') span").text('Crear');
			$("#dialog-form-partido").dialog("open");
		});

		$("#btnModifyPartido").button().click(function() {
			var partido = $('#lista').jqGrid('getRowData', porra.rowID);
			
			$("#ordinal").val(partido.ordinal);
			$("#local").val(partido.local);
			$("#visitante").val(partido.visitante);
			
			$('#dialog-form-partido').dialog('option', 'title', 'Modificar Partido');
			$(".ui-dialog-buttonpane button:contains('Crear') span").text('Modificar');
			$("#dialog-form-partido").dialog("open");
		});
		$("#btnModifyPartido").button("disable");
		
		$("#btnDeletePartido").button().click(function() {
			$('#lista').jqGrid('delRowData', porra.rowID);
			porra.deseleccionarPartido();
		});
		$("#btnDeletePartido").button("disable");
		
		$("#btnAsigResul").button().click(function() {
			$('#dialog-form-resultado').dialog('option', 'title', 'Asignar Resultado');
			$("#dialog-form-resultado").dialog("open");
			$('input:radio[name=resul]')[0].checked = true;
		});
		$("#btnAsigResul").button("disable");
		
		$("#tabs-partido").tabs();
		$("#tabs-resultado").tabs();
		
		$("#dialog-form-partido").dialog({
			autoOpen : false,
			height : 190,
			width : 900,
			modal : true,
			buttons : {
				"Aceptar" : function() {
					var error = "";
					if($('#ordinal').val() == ""){
						error += ' - Debe indicar el n&uacute;mero de orden del partido. <br/>';
					}
					if($('#local').val() == ""){
						error += ' - Debe indicar el equipo local <br/>';
					}
					if($('#visitante').val() == ""){
						error += ' - Debe indicar el equipo visitante <br/>';
					}
					if (error.length != 0){
						jAlert(error, 'Error');
						return;
					}
					var partido = {
						ordinal : $('#ordinal').val(),
						local : $('#local').val(),
						visitante : $('#visitante').val(),
					};
					
					var lastId = 1;
					if ($('#lista').getDataIDs().length > 0) {
						lastId = parseInt($('#lista').getDataIDs().length) + 1;
					}
					if (porra.rowID == null) {
						$('#lista').jqGrid("addRowData", lastId, partido, "last");
					} else{
						$('#lista').jqGrid('setRowData', porra.rowID, partido);
					}

					$(this).dialog("close");
				},
				"Cancelar" : function() {
					$(this).dialog("close");
				}
			},
			close : function() {
			}
		});
		
		$("#dialog-form-resultado").dialog({
			autoOpen : false,
			height : 200,
			width : 300,
			modal : true,
			buttons : {
				"Aceptar" : function() {
					var resultado = {
						resultado : $("input[name='resul']:checked").val(),
					};
					
					if (resultado.resultado != null) {
						$('#lista').jqGrid('setRowData', porra.rowID, resultado);
					}

					$(this).dialog("close");
				},
				"Cancelar" : function() {
					$(this).dialog("close");
				}
			},
			close : function() {
			}
		});
		
	},
	'deseleccionarPartido' : function(){
		this.rowID = null;
		$('#lista').jqGrid('resetSelection');
		$("#btnModifyPartido").button("disable");
		$("#btnDeletePartido").button("disable");
	},
	'getParams' : function() {
		var id = ($("#id").val()) ? $("#id").val() : null;
		var competicion = $("input[id=competicion]").val();
		var fechaLimite = $("input[id=fecha_limite]").val();
		var partidos = $('#lista').jqGrid('getRowData');

		var errores = '';
		if (competicion == '') {
			errores += '- Debe introducir el nombre de la competici&oacute;n<br/>';
		}
		if (fechaLimite == '') {
			errores += '- Debe introducir la fecha l&imite para poder rellenar la porra<br/>';
		}
		else {
			var porra = {
				id : id,
				competicion : competicion,
				fechaLimite : fechaLimite,
				partidosDTO : partidos
			};
			
			var entity = (id != null) ? 'porra/' + id : 'porra';
			generic.post(entity, porra, function() {
				generic.getList('porra');
			});
		};
	},'buscar' : function(competicion, equipo) {
		var data = {
			competicion : competicion,
			equipo : equipo
		};
		generic.post('porra/busqueda',data,generic.showInformation);
	}
};
