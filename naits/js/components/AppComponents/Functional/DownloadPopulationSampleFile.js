import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import * as config from 'config/config.js'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class DownloadPopulationSampleFile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      reRender: ''
    }
  }

  componentDidMount () {
    // Attach click event listeners
    this.attachClickEventListeners()
  }

  attachClickEventListeners = () => {
    const initialSampleBtn = document.getElementById('download_initial_sample')
    if (initialSampleBtn) {
      initialSampleBtn.onclick = this.showInitialSampleAlert
    }

    const stratifiedSampleBtn = document.getElementById('download_stratified_sample')
    if (stratifiedSampleBtn) {
      stratifiedSampleBtn.onclick = this.showStratifiedSampleAlert
    }
  }

  showInitialSampleAlert = () => {
    const populationId = this.props.componentStack[0].row['POPULATION.POPULATION_ID']
    this.setState({
      alert: alertUser(
        true,
        'info',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.download_latest_sample`,
          defaultMessage: `${config.labelBasePath}.main.download_latest_sample`
        }) + ` sample_attachment_${populationId}.xls`,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.download_latest_sample_prompt`,
          defaultMessage: `${config.labelBasePath}.main.download_latest_sample_prompt`
        }),
        () => {
          this.downloadPopulationSampleFile('sample_attachment')
        },
        () => {
          this.close()
        },
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.download`,
          defaultMessage: `${config.labelBasePath}.main.forms.download`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.cancel`,
          defaultMessage: `${config.labelBasePath}.main.forms.cancel`
        })
      )
    })
  }

  showStratifiedSampleAlert = () => {
    const populationId = this.props.componentStack[0].row['POPULATION.POPULATION_ID']
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.CHECK_IF_FILE_EXISTS
    let url = `${server}${verbPath}`
    url = url.replace('%sessionId', this.props.svSession)
    url = url.replace('%fileName', `strat_sample_${this.props.objectId}`)

    axios.get(url).then(res => {
      if (res.data) {
        this.setState({
          alert: alertUser(
            true,
            'info',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.download_latest_sample`,
              defaultMessage: `${config.labelBasePath}.main.download_latest_sample`
            }) + ` stratification_attachment_${populationId}.xls`,
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.download_latest_sample_prompt`,
              defaultMessage: `${config.labelBasePath}.main.download_latest_sample_prompt`
            }),
            () => {
              this.downloadPopulationSampleFile('stratification_attachment')
            },
            () => {
              this.close()
            },
            true,
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.forms.download`,
              defaultMessage: `${config.labelBasePath}.main.forms.download`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.forms.cancel`,
              defaultMessage: `${config.labelBasePath}.main.forms.cancel`
            })
          )
        })
      } else {
        this.setState({
          alert: alertUser(
            true,
            'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.strat_file_not_available`,
              defaultMessage: `${config.labelBasePath}.main.strat_file_not_available`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.strat_file_not_available_desc`,
              defaultMessage: `${config.labelBasePath}.main.strat_file_not_available_desc`
            }) + ' ' + this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.strat_file_not_available_desc_1`,
              defaultMessage: `${config.labelBasePath}.main.strat_file_not_available_desc_1`
            }),
            () => {
              this.close()
            }
          )
        })
      }
    })
  }

  downloadPopulationSampleFile = (sampleType) => {
    const currentPopulationId = this.props.componentStack[0].row['POPULATION.POPULATION_ID']
    let url = config.svConfig.triglavRestVerbs.DOWNLOAD_POPULATION_SAMPLE_FILE
    url = url.replace('%sessionId', this.props.svSession)
    url = url.replace('%populationId', this.props.objectId)
    url = url.replace('%fileLabelCode', sampleType)
    url = url.replace('%fileSuffix', currentPopulationId)
    window.open(`${config.svConfig.restSvcBaseUrl}/${url}`, '_blank')
  }

  close = () => {
    this.setState({ alert: false })
  }

  render () {
    const currentPopulationStatus = this.props.componentStack[0].row['POPULATION.STATUS']
    return (
      <React.Fragment>
        <button
          id='reRenderBtn'
          style={{ display: 'none' }}
          onClick={() => {
            document.getElementById('reRenderFinal') && document.getElementById('reRenderFinal').click()
          }}
        />
        <button
          id='reRenderFinal'
          style={{ display: 'none' }}
          onClick={() => this.setState({ reRender: 'reRenderFinal' })}
        />
        <div
          style={{
            cursor: currentPopulationStatus === 'VALID' ? 'none' : 'pointer',
            pointerEvents: currentPopulationStatus === 'VALID' ? 'none' : null,
            marginRight: '0',
            marginTop: '5px',
            float: 'right',
            backgroundColor: currentPopulationStatus === 'VALID' ? '#333333' : '#1A2B12',
            boxShadow: '4px 4px 10px #090E06',
            color: '#DFF2F6',
            width: '200px',
            height: '65px'
          }}
          id='download_population_sample_container'
          className={styles.container}
        >
          {currentPopulationStatus !== 'VALID'
            ? <p style={{ marginLeft: '20px', marginTop: '4px', width: '70px' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.download_latest_sample`,
                defaultMessage: `${config.labelBasePath}.main.download_latest_sample`
              })}
            </p>
            : <p style={{ marginLeft: '20px', marginTop: '12px', width: '70px', color: '#66717E' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.no_sample_available`,
                defaultMessage: `${config.labelBasePath}.main.no_sample_available`
              })
              }
            </p>
          }
          <div id='download_population_sample' style={{ marginLeft: '20px', marginTop: '4px' }} className={styles['gauge-container']}>
            <svg viewBox='0 0 512 512'>
              <path style={{ fill: currentPopulationStatus !== 'VALID' ? '#FFFFFF' : '#66717E' }}
                d='M438.557,512H19.785c-8.216,0-14.876-6.66-14.876-14.876V256.916c0-8.216,6.66-14.876,14.876-14.876
                s14.876,6.66,14.876,14.876v225.332h389.021v-32.833c0-8.216,6.661-14.876,14.876-14.876c8.215,0,14.876,6.66,14.876,14.876v47.709
                C453.433,505.34,446.772,512,438.557,512z'
              />
              <g>
                <polygon style={{ fill: '#CEE8FA' }} points='19.785,177.122 19.785,172.332 175.581,14.876 175.581,177.122' />
                <rect x='196.154' y='219.435' style={{ fill: '#CEE8FA' }} width='296.061' height='163.65' />
              </g>
              <g>
                <path style={{ fill: currentPopulationStatus !== 'VALID' ? '#FFFFFF' : '#66717E' }}
                  d='M492.215,204.559h-38.782V14.876C453.433,6.66,446.772,0,438.557,0H175.581
                  c-0.183,0-0.363,0.021-0.546,0.027c-0.167,0.006-0.332,0.013-0.498,0.025c-0.643,0.046-1.282,0.118-1.909,0.245
                  c-0.013,0.003-0.027,0.007-0.042,0.01c-0.617,0.126-1.22,0.305-1.815,0.509c-0.155,0.054-0.309,0.109-0.463,0.167
                  c-0.585,0.222-1.159,0.469-1.711,0.762c-0.019,0.01-0.042,0.018-0.061,0.03c-0.568,0.305-1.108,0.66-1.635,1.04
                  c-0.135,0.098-0.268,0.196-0.4,0.299c-0.522,0.402-1.028,0.827-1.497,1.3L9.21,161.868c-0.35,0.353-0.678,0.721-0.988,1.104
                  c-0.207,0.254-0.388,0.521-0.576,0.784c-0.092,0.131-0.195,0.256-0.283,0.388c-0.214,0.324-0.405,0.66-0.592,0.998
                  c-0.046,0.083-0.1,0.162-0.143,0.245c-0.183,0.347-0.342,0.701-0.495,1.056c-0.037,0.086-0.082,0.168-0.116,0.256
                  c-0.14,0.341-0.256,0.689-0.369,1.038c-0.036,0.112-0.08,0.219-0.113,0.33c-0.095,0.321-0.17,0.646-0.242,0.971
                  c-0.033,0.147-0.076,0.293-0.106,0.442c-0.058,0.3-0.095,0.604-0.134,0.907c-0.024,0.177-0.057,0.351-0.074,0.53
                  c-0.028,0.303-0.034,0.607-0.045,0.912c-0.006,0.167-0.024,0.332-0.024,0.498v4.792c0,8.216,6.66,14.876,14.876,14.876h155.796
                  c8.216,0,14.876-6.66,14.876-14.876V29.752h233.225v174.807H196.156c-8.216,0-14.876,6.66-14.876,14.876v163.644
                  c0,8.216,6.66,14.876,14.876,14.876h296.059c8.215,0,14.876-6.66,14.876-14.876V219.435
                  C507.091,211.219,500.43,204.559,492.215,204.559z M50.691,162.246L160.705,51.06v111.186H50.691z M477.339,368.203H211.032
                  V234.311h266.308V368.203z'
                />
                <path style={{ fill: currentPopulationStatus !== 'VALID' ? '#333333' : '#66717E' }}
                  d='M255.692,313.875l-16.073,27.302c-0.771,1.211-2.312,1.761-4.073,1.761
                  c-4.734,0-11.45-3.743-11.45-8.476c0-0.991,0.33-1.981,0.992-3.082l19.046-29.393l-18.275-29.283
                  c-0.771-1.211-1.101-2.312-1.101-3.413c0-4.623,6.275-8.148,11.12-8.148c2.422,0,4.073,0.881,5.174,2.862l14.642,25.54
                  l14.641-25.54c1.101-1.981,2.754-2.862,5.175-2.862c4.844,0,11.12,3.523,11.12,8.148c0,1.101-0.332,2.202-1.101,3.413
                  l-18.275,29.283l19.046,29.393c0.66,1.101,0.991,2.092,0.991,3.082c0,4.734-6.715,8.476-11.449,8.476
                  c-1.761,0-3.413-0.55-4.073-1.761L255.692,313.875z'
                />
                <path style={{ fill: currentPopulationStatus !== 'VALID' ? '#333333' : '#66717E' }}
                  d='M301.595,342.277c-3.744,0-7.487-1.761-7.487-5.284v-70.017c0-3.633,4.295-5.174,8.586-5.174 c4.295,0,8.586,1.541,8.586,5.174v60.329h25.1c3.304,0,4.955,3.744,4.955,7.487c0,3.743-1.651,7.486-4.955,7.486h-34.786V342.277z'
                />
                <path style={{ fill: currentPopulationStatus !== 'VALID' ? '#333333' : '#66717E' }}
                  d='M381.294,320.7c0-13.321-34.899-11.01-34.899-36.77c0-16.514,14.422-22.788,28.182-22.788
                  c5.836,0,21.909,1.101,21.909,9.689c0,2.972-1.981,9.027-6.827,9.027c-3.963,0-6.055-4.183-15.083-4.183
                  c-7.816,0-11.008,3.192-11.008,6.605c0,11.01,34.899,8.918,34.899,36.66c0,15.853-11.56,24.44-27.523,24.44
                  c-14.421,0-26.531-7.045-26.531-14.312c0-3.744,3.304-9.248,7.486-9.248c5.175,0,8.476,8.148,18.715,8.148
                  C375.68,327.967,381.294,325.985,381.294,320.7z'
                />
                <path style={{ fill: currentPopulationStatus !== 'VALID' ? '#333333' : '#66717E' }}
                  d='M433.473,313.875l-16.073,27.302c-0.772,1.211-2.313,1.761-4.073,1.761
                  c-4.735,0-11.449-3.743-11.449-8.476c0-0.991,0.33-1.981,0.991-3.082l19.046-29.393l-18.275-29.283
                  c-0.771-1.211-1.101-2.312-1.101-3.413c0-4.623,6.276-8.148,11.12-8.148c2.422,0,4.073,0.881,5.175,2.862l14.642,25.54
                  l14.642-25.54c1.099-1.981,2.752-2.862,5.174-2.862c4.845,0,11.12,3.523,11.12,8.148c0,1.101-0.33,2.202-1.101,3.413
                  l-18.274,29.283l19.046,29.393c0.66,1.101,0.991,2.092,0.991,3.082c0,4.734-6.717,8.476-11.449,8.476
                  c-1.763,0-3.414-0.55-4.073-1.761L433.473,313.875z'
                />
              </g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g />
            </svg>
            <div className={styles['dropdown-content']} style={{ width: '200px', right: '-31px' }}>
              <div key='download_initial_sample' id='download_initial_sample'>
                {
                  this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.download_initial_sample`,
                    defaultMessage: `${config.labelBasePath}.main.download_initial_sample`
                  })
                }
              </div>
              <div key='download_stratified_sample' id='download_stratified_sample'>
                {
                  this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.download_stratified_sample`,
                    defaultMessage: `${config.labelBasePath}.main.download_stratified_sample`
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

DownloadPopulationSampleFile.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  populationStatusHasBeenUpdated: state.updatePopulationStatus.populationStatusHasBeenUpdated,
  stratificationHasBeenGenerated: state.updatePopulationStatus.stratificationHasBeenGenerated
})

export default connect(mapStateToProps)(DownloadPopulationSampleFile)
