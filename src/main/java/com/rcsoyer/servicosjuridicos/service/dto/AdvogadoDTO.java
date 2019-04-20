package com.rcsoyer.servicosjuridicos.service.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.io.IOException;
import java.io.Serializable;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

/**
 * A DTO for the Advogado entity.
 */
@Getter
@Setter
@ToString
@Accessors(chain = true)
@EqualsAndHashCode(of = {"id", "nome"})
public class AdvogadoDTO implements Serializable {
    
    private static final long serialVersionUID = 185125590770954216L;
    
    private Long id;
    
    @NotBlank
    @Size(max = 80)
    private String nome;
    
    @NotBlank
    @Size(min = 11, max = 11)
    private String cpf;
    
    private Integer ramal;
    
    @JsonCreator
    public static AdvogadoDTO of(String json) throws IOException {
        return JsonConverter.readValue(json, AdvogadoDTO.class);
    }
}

