package com.rcsoyer.servicosjuridicos.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.rcsoyer.servicosjuridicos.service.dto.CoordenacaoJuridicaDTO;

/**
 * Service Interface for managing CoordenacaoJuridica.
 */
public interface CoordenacaoJuridicaService {

  /**
   * Save a coordenacaoJuridica.
   *
   * @param coordenacaoJuridicaDTO the entity to save
   * @return the persisted entity
   */
  CoordenacaoJuridicaDTO save(CoordenacaoJuridicaDTO coordenacaoJuridicaDTO);

  /**
   * Get all the coordenacaoJuridicas.
   *
   * @param pageable the pagination information
   * @return the list of entities
   */
  Page<CoordenacaoJuridicaDTO> findAll(Pageable pageable);

  Page<CoordenacaoJuridicaDTO> findByParams(CoordenacaoJuridicaDTO dto, Pageable pageable);

  /**
   * Get the "id" coordenacaoJuridica.
   *
   * @param id the id of the entity
   * @return the entity
   */
  CoordenacaoJuridicaDTO findOne(Long id);

  /**
   * Delete the "id" coordenacaoJuridica.
   *
   * @param id the id of the entity
   */
  void delete(Long id);

  Page<CoordenacaoJuridicaDTO> findAllWithEagerRelationships(CoordenacaoJuridicaDTO dto);
}