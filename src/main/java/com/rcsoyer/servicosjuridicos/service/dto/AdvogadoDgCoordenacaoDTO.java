package com.rcsoyer.servicosjuridicos.service.dto;

import java.io.IOException;
import java.io.Serializable;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.rcsoyer.servicosjuridicos.domain.enumeration.RangeDgCoordenacao;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * A DTO for the AdvogadoDgCoordenacao entity.
 */
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"advogadoId", "coordenacaoId"})
public class AdvogadoDgCoordenacaoDTO implements Serializable {

  private static final long serialVersionUID = 7110673865104666877L;

  private Long id;

  @NotNull
  @Size(min = 1, max = 1)
  private String dgPessoalInicio;

  @Size(min = 1, max = 1)
  private String dgPessoalFim;

  @Size(min = 1, max = 1)
  private String dgDupla;

  private RangeDgCoordenacao rangeDgCoordenacao;

  @NotNull
  private Long advogadoId;

  @NotNull
  private Long coordenacaoId;

  @JsonCreator
  public static AdvogadoDgCoordenacaoDTO of(String json)
      throws JsonParseException, JsonMappingException, IOException {
    return JsonConverter.readValue(json, AdvogadoDgCoordenacaoDTO.class);
  }
}